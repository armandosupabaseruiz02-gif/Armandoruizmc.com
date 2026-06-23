# Checklist de produccion

Fecha de preparacion tecnica: 2026-06-23.

## Listo en codigo

- Build de Next.js 16 validado localmente.
- Rutas protegidas redirigen a login y las paginas admin revalidan rol en servidor.
- Solicitudes publicas entran por `/api/contact-requests` con validacion, honeypot y rate limit basico.
- Fechas de agenda/admin usan dia de Ciudad de Mexico, no UTC.
- Consultas de citas/solicitudes evitan `select("*")` en superficies cliente/admin.
- Tipografia Atkinson Hyperlegible configurada como fuente principal.
- Migracion `20260623_production_hardening.sql` agregada para grants explicitos, RLS de cancelacion ciudadana, helpers privados y columna `appointments.topic`.

## Manual antes de publicar definitivamente

1. En Supabase SQL Editor, aplicar en orden todas las migraciones listadas en `supabase/README.md`, incluida:
   `supabase/migrations/20260623_production_hardening.sql`.
2. Crear o confirmar la cuenta admin y asignar `profiles.role = 'admin'`.
3. Configurar Supabase Auth:
   - Site URL: `https://www.armandoruizmc.com`.
   - Redirect URLs de produccion y local listadas en `supabase/README.md`.
   - Plantillas `Confirm signup` y `Reset password`.
4. En Vercel Production, confirmar variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `APPOINTMENTS_ADMIN_EMAIL`
   - `EMAIL_FROM`
   - `INSTAGRAM_ACCESS_TOKEN` cuando Meta entregue token valido.
5. Completar y aprobar legalmente `/aviso-privacidad`; no retirar el banner de borrador hasta tener aprobacion.
6. Hacer prueba real con dos cuentas:
   - Ciudadano: registro, confirmacion, login, agendar, cancelar.
   - Admin: entrar a `/admin/citas`, aceptar, rechazar, cancelar y agregar enlace de videollamada.
7. Probar correos reales:
   - Confirmacion de cuenta.
   - Recuperacion de contrasena.
   - Cita pendiente.
   - Aviso al responsable.
   - Cita confirmada/rechazada/cancelada.
8. Sustituir contenido pendiente: telefono, correo, domicilio, foto oficial, casos reales de donacion y consentimientos.

## Prueba rapida post-deploy

```bash
for p in / /salud /auth/login /programas-sociales /aviso-privacidad /accesibilidad /robots.txt /sitemap.xml; do
  curl -L -s -o /dev/null -w "$p %{http_code}\n" "https://www.armandoruizmc.com$p"
done
```
