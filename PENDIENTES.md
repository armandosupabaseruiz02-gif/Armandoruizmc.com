# PENDIENTES - Portal Diputado Armando Ruiz

> Tablero operativo. Ultima reorganizacion: **2026-06-19**.
> Fuente de verdad tecnica: codigo + `supabase/migrations/`.

## Estado actual

- Codigo local: lint, build de produccion y audit de dependencias de produccion correctos (26 rutas, 2026-06-19).
- GitHub oficial: `armandosupabaseruiz02-gif/Armandoruizmc.com`.
- Supabase local: variables configuradas en `.env.local`.
- Vercel: proyecto `armandoruizmc-com`; dominio conectado y redirigiendo a `https://www.armandoruizmc.com`.
- Dominio canonico del codigo: `https://www.armandoruizmc.com`.
- Supabase Auth en produccion: registro, confirmacion por correo y login ya llegan a Supabase; Custom SMTP con Resend configurado; correos de citas conectados con Resend; falta prueba completa de usuario/admin.
- Instagram API: sin token configurado.

## 1. Bloqueadores de lanzamiento

### Prioridad cero: prueba completa de citas y correos

- [ ] **MANUAL - Supabase Auth:** revisar plantillas de `Confirm signup` y `Reset password` con tono oficial y enlaces a `armandoruizmc.com`.
- [ ] Probar flujo final en produccion: usuario agenda cita -> llega correo al usuario -> llega aviso al responsable -> admin confirma/rechaza/cancela -> llega correo de estado al usuario.
- [ ] Probar recuperacion de contrasena con correo real.
- [ ] Implementar correo de bienvenida despues de confirmar cuenta.

### Base de datos y seguridad

- [x] Versionar migracion de seguridad y flujo de citas: `supabase/migrations/20260614_secure_appointments_workflow.sql`.
- [x] **MANUAL - Supabase:** ejecutar migraciones base en SQL Editor y verificar esquema real.
- [ ] **MANUAL - Supabase:** crear o identificar la cuenta administradora y asignarle `role = 'admin'` usando `supabase/README.md`.
- [ ] Probar con dos cuentas: un ciudadano no puede ver citas ajenas, modificar roles ni entrar a `/admin/citas`.

### Legal y datos sensibles

- [ ] **MANUAL - Equipo/juridico:** completar el Aviso de Privacidad con nombre legal, domicilio, correo, telefono, fecha y transferencias reales.
- [ ] **MANUAL - Juridico:** aprobar el aviso antes de publicar. Se recopilan CURP y datos vinculados con salud.
- [ ] **MANUAL - Equipo:** proporcionar correo real para privacidad y reportes de accesibilidad.
- [ ] Retirar el banner de borrador del aviso solamente despues de su aprobacion.

### Publicacion

- [x] Subir a GitHub los cambios locales verificados.
- [x] **MANUAL - Cuenta del diputado:** comprar o confirmar la propiedad de `armandoruizmc.com`.
- [x] Conectar el repositorio oficial a Vercel en la cuenta del diputado.
- [x] Confirmar en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Production.
- [x] Confirmar en Vercel `RESEND_API_KEY` y `APPOINTMENTS_ADMIN_EMAIL` en Production.
- [x] Conectar el dominio al proyecto de Vercel y esperar DNS/SSL.
- [ ] Configurar Supabase Auth:
  - Site URL: `https://www.armandoruizmc.com`.
  - Redirect URL: `https://www.armandoruizmc.com/auth/callback`.
  - Redirect URL con query para confirmacion/restablecimiento si Supabase lo requiere:
    `https://www.armandoruizmc.com/auth/callback?next=/mi-cuenta`
    `https://www.armandoruizmc.com/auth/callback?next=/auth/restablecer`
  - Redirect URL adicional para dominio sin `www`: `https://armandoruizmc.com/auth/callback`.
  - Redirect URL local para pruebas: `http://localhost:3000/auth/callback`.
  - Plantillas de confirmacion y recuperacion de contrasena.
- [ ] Prueba final en produccion: registro -> confirmar correo -> login -> solicitar cita -> aceptar/rechazar en admin -> cancelar desde Mi Cuenta.

## 2. Funciones terminadas en codigo, pendientes de activacion

- [x] Redirecciones de login/registro/callback limitadas a rutas internas.
- [x] Registro compatible con confirmacion por correo y metadata de nombre/telefono.
- [x] Recuperacion y restablecimiento de contrasena.
- [x] Solicitudes de cita en estado `pending`.
- [x] Panel admin con bandeja "Por revisar", aceptar y rechazar con motivo.
- [x] Mi Cuenta muestra estados pendiente, confirmada y rechazada.
- [x] Cancelacion ciudadana mediante RPC restringida a la propia cita.
- [x] RLS versionado para perfiles, citas y dias bloqueados.
- [x] Horarios rechazados/cancelados pueden liberarse mediante indice unico parcial.
- [x] Aplicar las migraciones Supabase para activar citas, seguridad y solicitudes internas en la base real:
  - `supabase/migrations/20260614_secure_appointments_workflow.sql`
  - `supabase/migrations/20260617_contact_requests.sql`
- [x] Aplicar la migracion para correos de citas:
  - `supabase/migrations/20260618_appointment_email_notifications.sql`
- [x] Endurecer permisos de funciones Supabase:
  - `supabase/migrations/20260618_harden_function_permissions.sql`
  - `supabase/migrations/20260618_revoke_unused_get_my_role.sql`

## 3. Datos y conexiones que necesito del equipo

### Contacto e identidad

- [ ] Telefono oficial.
- [ ] Correo oficial general.
- [ ] Correo especifico de privacidad, si sera distinto.
- [ ] Domicilio completo de la oficina.
- [ ] Foto oficial de Armando.
- [ ] Confirmar si el emblema de sombrero tambien se usara en una animacion de marca.
- [ ] Confirmar perfiles sociales oficiales adicionales. Instagram ya apunta a `@armandoruizdiputado`.

### Instagram

- [ ] **MANUAL - Meta:** generar/configurar un token valido para la cuenta autorizada.
- [ ] Agregar `INSTAGRAM_ACCESS_TOKEN` en Vercel, nunca en Git.
- [ ] Verificar que `/api/instagram` muestre publicaciones reales.

### Donaciones

- [ ] Correo o WhatsApp oficial para recibir solicitudes de ayuda.
- [ ] Casos reales, costos y evidencia autorizada.
- [ ] Consentimiento firmado del beneficiario/tutor antes de publicar nombre o fotografia.
- [ ] Sustituir los cuatro casos de demostracion actuales.

## 4. Mejoras posteriores al lanzamiento

- [ ] Recordatorios de citas por WhatsApp o correo.
- [ ] "Mi Expediente" con documentos privados y seguimiento.
- [ ] Backend de donaciones: casos, donantes, moderacion y Storage.
- [ ] Panel admin como mini-CRM: notas, asignacion y metricas.
- [ ] Permitir que un familiar gestione tramites por la persona con discapacidad.
- [ ] Auditoria WCAG 2.1 AA con lectores de pantalla y navegacion por teclado.
- [ ] Analitica respetuosa de privacidad y SEO por pagina.

## 5. Registro de trabajo terminado

- [x] Home con lanzador de tareas `AyudaHoy`.
- [x] Selector de tema en citas: Salud / Apoyo a discapacidad.
- [x] Modalidad presencial / en linea y enlace de videollamada.
- [x] Calendario 9:00-17:00, dias bloqueados y prevencion de doble reserva.
- [x] Cuenta ciudadana y panel de administracion.
- [x] Modales accesibles en lugar de `prompt`, `confirm` y `alert`.
- [x] Aviso de Privacidad y Declaracion de Accesibilidad creados como borradores.
- [x] SEO base, sitemap, robots e Instagram con fallback sin token.
- [x] Navbar adaptable, progreso de lectura y animaciones con `prefers-reduced-motion`.
- [x] ESLint actualizado para Next.js 16.
- [x] Proteccion agregada para que paginas publicas no caigan en error 500 si faltan variables de Supabase en Vercel.
- [x] Bot de orientacion gratuita agregado en Programas Sociales para sustituir el envio directo por correo.
- [x] Formularios internos agregados para postulaciones, vacantes, aliados, donaciones y accesibilidad.
- [x] Bandeja admin creada en `/admin/solicitudes`.
- [x] **MANUAL - Supabase:** aplicar `supabase/migrations/20260617_contact_requests.sql` para activar solicitudes internas.
- [x] Resend creado, dominio `armandoruizmc.com` verificado y Custom SMTP configurado en Supabase.
- [x] Variables de correo en Vercel configuradas: `RESEND_API_KEY` y `APPOINTMENTS_ADMIN_EMAIL`.
- [x] Correos de citas implementados con Resend: solicitud pendiente, aviso al responsable, confirmacion, rechazo y cancelacion.
- [x] Migracion `20260618_appointment_email_notifications.sql` aplicada y verificada contra Supabase.
- [x] Favicon y Apple icon reemplazados por el emblema de sombrero con fondo transparente.
- [x] SEO canonico actualizado a `https://www.armandoruizmc.com` en metadata, sitemap y robots.
- [x] Titulos duplicados corregidos y textos de Estado de Mexico cambiados a CDMX.
- [x] Paleta depurada: se retiraron azules/morados frios de paginas y paneles principales.
- [x] Navbar y footer ahora navegan a `/#seccion` cuando se usan fuera de la home.
- [x] Correos de citas endurecidos: el cliente manda `appointmentId` y el servidor lee la cita real en Supabase.
- [x] Enlaces de videollamada validados como `http(s)` y correo agregado cuando el admin guarda el enlace.
- [x] Solicitudes internas con honeypot/tiempo minimo anti-spam y selector de estado en admin.
- [x] Restablecimiento de contrasena con confirmacion y medidor de seguridad.
- [x] Modales principales con cierre por Escape y trampa de foco por teclado.
- [x] Dependencias actualizadas a Next `16.2.9`, React `19.2.4` y audit de produccion limpio.
- [x] Header/navbar global retirado por solicitud del cliente.
