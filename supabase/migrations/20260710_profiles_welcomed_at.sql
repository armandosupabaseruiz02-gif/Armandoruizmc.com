-- Portal Diputado Armando Ruiz
-- Marca de correo de bienvenida enviado: se envia UNA sola vez por usuario
-- (primer login via /auth/callback, sea Google o confirmacion de correo).

begin;

alter table public.profiles
  add column if not exists welcomed_at timestamptz;

commit;
