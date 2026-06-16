# PENDIENTES - Portal Diputado Armando Ruiz

> Tablero operativo. Ultima reorganizacion: **2026-06-16**.
> Fuente de verdad tecnica: codigo + `supabase/migrations/`.

## Estado actual

- Codigo local: lint y build de produccion correctos (22 rutas, 2026-06-16).
- GitHub oficial: `armandosupabaseruiz02-gif/Armandoruizmc.com`.
- Supabase local: variables configuradas en `.env.local`.
- Vercel: proyecto `armandoruizmc-com`; build correcto, produccion necesita variables de Supabase para activar auth/citas/admin.
- URL temporal de Vercel: `https://armandoruizmc-com.vercel.app`.
- Dominio previsto: `armandoruizmc.com`.
- Instagram API: sin token configurado.

## 1. Bloqueadores de lanzamiento

### Base de datos y seguridad

- [x] Versionar migracion de seguridad y flujo de citas: `supabase/migrations/20260614_secure_appointments_workflow.sql`.
- [ ] **MANUAL - Supabase:** hacer respaldo y ejecutar la migracion en SQL Editor.
- [ ] **MANUAL - Supabase:** crear o identificar la cuenta administradora y asignarle `role = 'admin'` usando `supabase/README.md`.
- [ ] Probar con dos cuentas: un ciudadano no puede ver citas ajenas, modificar roles ni entrar a `/admin/citas`.

### Legal y datos sensibles

- [ ] **MANUAL - Equipo/juridico:** completar el Aviso de Privacidad con nombre legal, domicilio, correo, telefono, fecha y transferencias reales.
- [ ] **MANUAL - Juridico:** aprobar el aviso antes de publicar. Se recopilan CURP y datos vinculados con salud.
- [ ] **MANUAL - Equipo:** proporcionar correo real para privacidad y reportes de accesibilidad.
- [ ] Retirar el banner de borrador del aviso solamente despues de su aprobacion.

### Publicacion

- [x] Subir a GitHub los cambios locales verificados.
- [ ] **MANUAL - Cuenta del diputado:** comprar o confirmar la propiedad de `armandoruizmc.com`.
- [x] Conectar el repositorio oficial a Vercel en la cuenta del diputado.
- [ ] Configurar en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Conectar el dominio al proyecto de Vercel y esperar DNS/SSL.
- [ ] Configurar Supabase Auth:
  - Site URL: `https://armandoruizmc.com`.
  - Redirect URL: `https://armandoruizmc.com/auth/callback`.
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
- [ ] Aplicar la migracion Supabase para activar las funciones anteriores en la base real.

## 3. Datos y conexiones que necesito del equipo

### Contacto e identidad

- [ ] Telefono oficial.
- [ ] Correo oficial general.
- [ ] Correo especifico de privacidad, si sera distinto.
- [ ] Domicilio completo de la oficina.
- [ ] Foto oficial de Armando.
- [ ] Foto del sombrero ranchero naranja para preparar la animacion de marca.
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
