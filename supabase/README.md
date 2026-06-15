# Supabase

Las migraciones de esta carpeta son la fuente versionada del esquema y sus permisos.

## Aplicacion manual

1. Abrir el proyecto correcto en Supabase.
2. Crear un respaldo o probar primero en una rama/proyecto de prueba.
3. Abrir SQL Editor.
4. Ejecutar, en orden, los archivos de `migrations/`.
5. Probar registro, cita pendiente, aceptacion, rechazo y cancelacion.

## Administrador inicial

Despues de que la persona administradora cree su cuenta, ejecutar sustituyendo el correo:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'CORREO_ADMIN_REAL'
);
```

No se incluye ninguna `service_role` ni credencial privada en el repositorio.
