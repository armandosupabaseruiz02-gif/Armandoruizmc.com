-- Portal Diputado Armando Ruiz
-- Cierra permisos publicos no necesarios en funciones RPC/trigger.

begin;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.get_my_role()
returns text
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.cancel_my_appointment(uuid) from public, anon, authenticated;
grant execute on function public.cancel_my_appointment(uuid) to authenticated;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.get_my_role() from public, anon, authenticated;
grant execute on function public.get_my_role() to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

drop policy if exists contact_requests_public_insert on public.contact_requests;
create policy contact_requests_public_insert
  on public.contact_requests for insert
  to anon, authenticated
  with check (
    length(trim(full_name)) > 1
    and length(trim(subject)) > 1
    and length(trim(message)) > 4
    and request_type in (
      'job_application',
      'vacancy_registration',
      'ally',
      'donation',
      'accessibility',
      'general'
    )
  );

commit;
