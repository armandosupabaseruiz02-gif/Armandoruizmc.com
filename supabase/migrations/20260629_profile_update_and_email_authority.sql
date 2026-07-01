-- Portal Diputado Armando Ruiz
-- Fase 2 de endurecimiento de produccion (auditoria 2026-06-28/29):
--   1) citizen_email autoritativo server-side en appointments (anti-spoofing).
--   2) politica RLS para que cada quien actualice su propio perfil, con guarda
--      que impide a un ciudadano escalar su propio rol a 'admin'.

begin;

-- 1) Al insertar una cita, el email del ciudadano lo decide el servidor a partir
--    del JWT autenticado; se ignora cualquier citizen_email enviado por el cliente.
create or replace function private.set_appointment_citizen_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.citizen_email := coalesce(auth.email(), new.citizen_email);
  return new;
end;
$$;

revoke all on function private.set_appointment_citizen_email() from public, anon, authenticated;

drop trigger if exists set_appointment_citizen_email on public.appointments;
create trigger set_appointment_citizen_email
  before insert on public.appointments
  for each row execute function private.set_appointment_citizen_email();

-- 2a) Guarda anti-escalacion: si un no-admin intenta cambiar su rol, se conserva el original.
create or replace function private.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not private.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

revoke all on function private.guard_profile_role() from public, anon, authenticated;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update on public.profiles
  for each row execute function private.guard_profile_role();

-- 2b) Cada usuario autenticado puede actualizar su propio perfil
--     (nombre, telefono, curp). El campo role queda blindado por el trigger anterior.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

commit;
