-- Portal Diputado Armando Ruiz
-- Endurecimiento de produccion: grants explicitos, helpers privados y tema de cita.

begin;

create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated, service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'citizen'
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        phone = coalesce(excluded.phone, public.profiles.phone);
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.appointments
  add column if not exists topic text;

alter table public.appointments
  drop constraint if exists appointments_topic_check;

alter table public.appointments
  add constraint appointments_topic_check
  check (topic is null or topic in ('salud', 'discapacidad'));

update public.appointments
set topic = case
  when motive ilike '[Apoyo a discapacidad]%' then 'discapacidad'
  else 'salud'
end
where topic is null;

alter table public.appointments
  alter column topic set default 'salud';

create index if not exists appointments_citizen_date_idx
  on public.appointments (citizen_id, appointment_date, slot_time);

create index if not exists appointments_admin_status_date_idx
  on public.appointments (status, appointment_date, slot_time);

create index if not exists contact_requests_type_created_at_idx
  on public.contact_requests (request_type, created_at desc);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.blocked_days enable row level security;
alter table public.contact_requests enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

revoke all on table public.appointments from anon, authenticated;
grant select, insert, update on table public.appointments to authenticated;
grant select, insert, update, delete on table public.appointments to service_role;

revoke all on table public.blocked_days from anon, authenticated;
grant select on table public.blocked_days to authenticated;
grant select, insert, update, delete on table public.blocked_days to authenticated;
grant select, insert, update, delete on table public.blocked_days to service_role;

revoke all on table public.contact_requests from anon, authenticated;
grant insert on table public.contact_requests to anon;
grant insert, select, update on table public.contact_requests to authenticated;
grant select, insert, update, delete on table public.contact_requests to service_role;

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all
  on public.profiles for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists appointments_admin_all on public.appointments;
create policy appointments_admin_all
  on public.appointments for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists appointments_update_own_cancel on public.appointments;
create policy appointments_update_own_cancel
  on public.appointments for update
  to authenticated
  using (
    citizen_id = auth.uid()
    and status in ('pending', 'confirmed')
  )
  with check (
    citizen_id = auth.uid()
    and status = 'cancelled_by_citizen'
  );

drop policy if exists blocked_days_admin_all on public.blocked_days;
create policy blocked_days_admin_all
  on public.blocked_days for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists contact_requests_admin_select on public.contact_requests;
create policy contact_requests_admin_select
  on public.contact_requests for select
  to authenticated
  using (private.is_admin());

drop policy if exists contact_requests_admin_update on public.contact_requests;
create policy contact_requests_admin_update
  on public.contact_requests for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists contact_requests_public_insert on public.contact_requests;
create policy contact_requests_public_insert
  on public.contact_requests for insert
  to anon, authenticated
  with check (
    request_type in (
      'job_application',
      'vacancy_registration',
      'ally',
      'donation',
      'accessibility',
      'general'
    )
    and length(trim(full_name)) between 2 and 120
    and length(trim(subject)) between 2 and 160
    and length(trim(message)) between 5 and 3000
    and (phone is null or length(trim(phone)) <= 30)
    and (
      email is null
      or (
        length(trim(email)) <= 254
        and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      )
    )
  );

revoke all on function public.cancel_my_appointment(uuid) from public, anon, authenticated;

revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

commit;
