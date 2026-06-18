# Supabase

Las migraciones de esta carpeta son la fuente versionada del esquema y sus permisos.

## Aplicacion manual

1. Abrir el proyecto correcto en Supabase.
2. Crear un respaldo o probar primero en una rama/proyecto de prueba.
3. Abrir SQL Editor.
4. Ejecutar, en orden:
   - `migrations/20260614_secure_appointments_workflow.sql`
   - `migrations/20260617_contact_requests.sql`
5. Probar registro, cita pendiente, aceptacion, rechazo, cancelacion y solicitudes internas.

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

Si pruebas localmente en otro puerto, agrega tambien esa URL, por ejemplo:

```text
http://localhost:3001/auth/callback
```

4. Revisar las plantillas de correo de confirmacion y recuperacion para que mencionen `armandoruizmc.com`.

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
