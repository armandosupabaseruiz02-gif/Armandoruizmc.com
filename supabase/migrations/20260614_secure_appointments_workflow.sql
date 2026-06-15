-- Portal Diputado Armando Ruiz
-- Flujo pending -> confirmed/rejected y endurecimiento de permisos.
-- Revisar en un proyecto de prueba antes de ejecutar en produccion.

begin;

alter table public.profiles
  alter column role set default 'ciudadano';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'ciudadano'
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        phone = coalesce(excluded.phone, public.profiles.phone);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sustituye el check anterior, sin depender del nombre que tenga actualmente.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.appointments'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.appointments drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.appointments
  alter column status set default 'pending';

alter table public.appointments
  add constraint appointments_status_check
  check (status in (
    'pending',
    'confirmed',
    'rejected',
    'completed',
    'cancelled_by_citizen',
    'cancelled_by_admin'
  ));

-- Una cita rechazada o cancelada debe liberar el horario.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.appointments'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) ilike 'unique (appointment_date, slot_time)%'
  loop
    execute format('alter table public.appointments drop constraint %I', constraint_name);
  end loop;
end $$;

do $$
declare
  index_name text;
begin
  for index_name in
    select indexname
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'appointments'
      and indexdef ilike 'create unique index%appointment_date%slot_time%'
      and indexname <> 'appointments_active_slot_unique'
  loop
    execute format('drop index if exists public.%I', index_name);
  end loop;
end $$;

drop index if exists public.appointments_active_slot_unique;
create unique index appointments_active_slot_unique
  on public.appointments (appointment_date, slot_time)
  where status in ('pending', 'confirmed');

create unique index if not exists blocked_days_date_unique
  on public.blocked_days (blocked_date);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Elimina politicas heredadas para evitar que una regla antigua deje datos abiertos.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'appointments', 'blocked_days')
  loop
    execute format(
      'drop policy %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.blocked_days enable row level security;

create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy profiles_admin_all
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy appointments_select_own
  on public.appointments for select
  to authenticated
  using (citizen_id = auth.uid());

create policy appointments_insert_own_pending
  on public.appointments for insert
  to authenticated
  with check (citizen_id = auth.uid() and status = 'pending');

create policy appointments_admin_all
  on public.appointments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy blocked_days_authenticated_read
  on public.blocked_days for select
  to authenticated
  using (true);

create policy blocked_days_admin_all
  on public.blocked_days for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.cancel_my_appointment(p_appointment_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.appointments
  set status = 'cancelled_by_citizen'
  where id = p_appointment_id
    and citizen_id = auth.uid()
    and status in ('pending', 'confirmed');

  if not found then
    raise exception 'Appointment not found or cannot be cancelled';
  end if;
end;
$$;

revoke all on function public.cancel_my_appointment(uuid) from public;
grant execute on function public.cancel_my_appointment(uuid) to authenticated;

commit;
