-- Portal Diputado Armando Ruiz
-- get_my_role es legado y no lo usa la aplicacion actual.

begin;

revoke all on function public.get_my_role() from public, anon, authenticated;

commit;
