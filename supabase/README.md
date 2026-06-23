# Supabase

Las migraciones de esta carpeta son la fuente versionada del esquema y sus permisos.

## Aplicacion manual

1. Abrir el proyecto correcto en Supabase.
2. Crear un respaldo o probar primero en una rama/proyecto de prueba.
3. Abrir SQL Editor.
4. Ejecutar, en orden:
   - `migrations/20260614_secure_appointments_workflow.sql`
   - `migrations/20260617_contact_requests.sql`
   - `migrations/20260618_appointment_email_notifications.sql`
   - `migrations/20260618_harden_function_permissions.sql`
   - `migrations/20260618_revoke_unused_get_my_role.sql`
   - `migrations/20260623_production_hardening.sql`
5. Probar registro, cita pendiente, aceptacion, rechazo, cancelacion, correos de citas y solicitudes internas.

## Auth y dominio

En Supabase Dashboard:

1. Ir a **Authentication** -> **URL Configuration**.
2. Configurar **Site URL**:

```text
https://armandoruizmc.com
```

3. Agregar en **Redirect URLs**:

```text
https://armandoruizmc.com/auth/callback
https://www.armandoruizmc.com/auth/callback
http://localhost:3000/auth/callback
```

Si Supabase no respeta el `next` usado en confirmacion o recuperacion, agregar tambien:

```text
https://armandoruizmc.com/auth/callback?next=/mi-cuenta
https://armandoruizmc.com/auth/callback?next=/auth/restablecer
```

Si pruebas localmente en otro puerto, agrega tambien esa URL, por ejemplo:

```text
http://localhost:3001/auth/callback
```

4. Revisar las plantillas de correo de confirmacion y recuperacion para que mencionen `armandoruizmc.com`.

## Correos transaccionales

Supabase Auth puede mandar correos de confirmacion y recuperacion, pero el SMTP default de Supabase no es para produccion. Para que lleguen correos a ciudadanos reales:

1. Crear/conectar Resend.
2. Verificar `armandoruizmc.com` en Resend.
3. Configurar DNS del dominio: SPF, DKIM y DMARC.
4. En Supabase Dashboard ir a **Authentication** -> **SMTP Settings**.
5. Activar Custom SMTP con los datos de Resend.
6. Mantener `mailer_autoconfirm` apagado para exigir confirmacion de correo.
7. Revisar estas plantillas en **Authentication** -> **Email Templates**:
   - Confirm signup.
   - Reset password.

Los correos de citas no los manda Supabase Auth. Esos se deben enviar desde la app con `RESEND_API_KEY` en Vercel y codigo server-side:

- `RESEND_API_KEY`: llave privada de Resend. Requerida para enviar.
- `APPOINTMENTS_ADMIN_EMAIL`: correo interno que recibe avisos de citas nuevas. Opcional pero recomendado.
- `EMAIL_FROM`: remitente, por ejemplo `Portal Armando Ruiz <noreply@armandoruizmc.com>`. Opcional; si falta, la app usa ese valor por defecto.

Ya esta versionado el envio de:

- Cita creada y pendiente de revision al ciudadano.
- Aviso de cita nueva al admin si `APPOINTMENTS_ADMIN_EMAIL` existe.
- Cita confirmada.
- Cita rechazada.
- Cita cancelada por admin.
- Cita cancelada por ciudadano.

## Administrador inicial

Despues de que la persona administradora cree su cuenta, ejecutar sustituyendo el correo:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'CORREO_ADMIN_REAL'
);
```

Verificar:

```sql
select id, full_name, role
from public.profiles
where role = 'admin';
```

No se incluye ninguna `service_role` ni credencial privada en el repositorio.
