# PENDIENTES - Portal Diputado Armando Ruiz

> Tablero operativo. Ultima reorganizacion: **2026-06-23**.
> Fuente de verdad tecnica: codigo + `supabase/migrations/`.

## Estado actual

- Codigo local: lint, build de produccion, audit de dependencias, smoke test de rutas y capturas movil/escritorio correctos (27 rutas, 2026-06-23).
- GitHub oficial: `armandosupabaseruiz02-gif/Armandoruizmc.com`.
- Supabase local: variables configuradas en `.env.local`.
- Vercel: proyecto `armandoruizmc-com`; dominio conectado y redirigiendo a `https://www.armandoruizmc.com`.
- Dominio canonico del codigo: `https://www.armandoruizmc.com`.
- Supabase Auth en produccion: registro, confirmacion por correo y login ya llegan a Supabase; Custom SMTP con Resend configurado; correos de citas conectados con Resend; falta prueba completa de usuario/admin.
- Instagram API: sin token configurado.
- Rediseño visual en local: header limpio reconstruido, hero con React Bits CardSwap, seccion `Rutas de apoyo` retirada de la landing, limpieza de `Atencion ciudadana` / `Como te ayudamos` e Instagram con coverflow/fallback. Validado con capturas locales movil y escritorio.

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
- [x] **MANUAL - Supabase:** aplicar `supabase/migrations/20260623_production_hardening.sql` en SQL Editor antes de la prueba final. **Aplicada 2026-06-28** (project `mmczynsmlfvkwrmmtapc`); verificado que la columna `appointments.topic` ya existe (default `salud`) y que los advisors de funciones `SECURITY DEFINER` desaparecieron. **Esto era BLOQUEANTE confirmado:** antes la columna `topic` faltaba en prod y el retry del insert en `BookingCalendar.tsx` borraba `citizen_email`, por lo que el aviso de cita admin->ciudadano (confirmada/rechazada/cancelada) nunca se enviaba.
- [x] Probar con dos cuentas: un ciudadano no puede ver citas ajenas, modificar roles ni entrar a `/admin/citas`. **Verificado a nivel RLS (2026-06-28)** simulando el JWT de un ciudadano que no posee citas: ve 0 citas ajenas, solo su propio perfil (1), 0 solicitudes de contacto; intento de escalar su rol a `admin` = 0 filas (bloqueado, no existe politica UPDATE de perfil propio) e intento de modificar la cita de otro = 0 filas. El bloqueo de la ruta `/admin/citas` esta ademas en el codigo (middleware + re-check `role==='admin'` por pagina). Falta solo, si se quiere, la prueba viva en navegador con dos sesiones reales.
- [ ] **MANUAL - confirmar:** hay **2 cuentas con `role='admin'`** en produccion (y 3 ciudadanos). Confirmar que ambas cuentas admin son intencionales.

#### Hallazgos de auditoria de produccion (2026-06-28)

- [ ] **MANUAL - Supabase Auth:** activar **Leaked Password Protection** (HaveIBeenPwned) en Auth -> Passwords. Unico advisor de seguridad restante; importante por la poblacion vulnerable.
- [x] **Headers de seguridad (2026-06-29):** agregados en `next.config.ts` via `headers()` para todas las rutas: HSTS (2 años, preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy (camara/micro/geo/topics off) y CSP. **CSP permisiva en script/style** ('unsafe-inline'/'unsafe-eval' por la hidratacion de Next sin nonce) pero acotada en `img-src`/`connect-src` a Supabase + Instagram + avatares de Google. Verificado con `curl -I` que se sirven. **Si la consola del navegador en produccion reporta un host bloqueado, agregarlo en `img-src`/`connect-src`**; a futuro se puede endurecer `script-src` con nonces.
- [x] **BUG-3 resuelto (2026-06-29):** `citizen_email` ahora es autoritativo server-side. Migracion `20260629_profile_update_and_email_authority.sql` agrega un trigger BEFORE INSERT en `appointments` que fuerza `citizen_email = auth.email()` (ignora lo que mande el cliente); ademas `notify/route.ts` en `type:"created"` usa `user.email`. Verificado: insert con email falso `atacante-falso@evil.com` se sobrescribio al email real del JWT.
- [x] **BUG-2 resuelto (2026-06-29):** agregada politica RLS `profiles_update_own` (UPDATE del propio perfil) en la misma migracion, **mas un trigger `guard_profile_role`** que impide a un no-admin cambiar su propio `role` (al abrir el UPDATE habia que blindar el campo `role`, antes protegido por la ausencia de politica). Verificado: el ciudadano puede editar su `full_name` pero su intento de pasar a `admin` deja el rol en `citizen`. Esto destraba habilitar Google OAuth mas adelante.
- [ ] **BUG-4 (bajo):** el rate-limit del formulario de contacto (`contact-requests/route.ts`) usa un `Map` en memoria, inutil en serverless; ademas la tabla es insertable directo con la anon key. Para limite real usar Upstash/Vercel KV.
- [ ] Versionar la creacion de tablas base (`profiles`/`appointments`/`blocked_days`) en `supabase/migrations/` — hoy el repo arranca en `20260614` y no puede recrear la DB desde cero.

### Legal y datos sensibles

- [ ] **MANUAL - Equipo/juridico:** completar el Aviso de Privacidad con nombre legal, domicilio, correo, telefono, fecha y transferencias reales. **Avance 2026-06-29:** seccion de cookies reescrita a la verdad (el sitio solo usa cookies de sesion de Supabase; SIN analitica ni rastreo de terceros — verificado en codigo) y URL del sitio rellenada (`https://www.armandoruizmc.com/aviso-privacidad`). **Placeholders que SIGUEN pendientes (requieren datos reales):** `[NOMBRE LEGAL DEL RESPONSABLE]`, `[DOMICILIO COMPLETO]`, `[CORREO DE PRIVACIDAD]` (x4), `[TELEFONO]`, `[FECHA DE ULTIMA ACTUALIZACION]` y ajustar la seccion 7 (transferencias) a las reales.
- [ ] **MANUAL - Juridico:** aprobar el aviso antes de publicar. Se recopilan CURP y datos vinculados con salud.
- [ ] **MANUAL - Equipo:** proporcionar correo real para privacidad y reportes de accesibilidad.
- [ ] Retirar el banner de borrador del aviso solamente despues de su aprobacion.

### Publicacion

- [x] Subir a GitHub los cambios locales verificados.
- [x] Verificar visualmente en `http://localhost:3000` el rediseño local de landing/header antes del push.
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
- [ ] Ejecutar checklist operativo de `PRODUCCION.md` despues del deploy.

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

### Iniciativas legislativas

- [ ] Textos reales de las iniciativas avaladas (titulo, resumen ciudadano, estado, fecha, enlace a Gaceta) para subirlas en `/admin/iniciativas`.

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
- [x] Retirados los cuatro casos de demostracion (datos inventados). La seccion Donar ahora muestra estado honesto + formularios "Quiero ofrecer ayuda" / "Pedir ayuda"; los casos reales se publicaran cuando haya consentimiento firmado.

## 4. Mejoras posteriores al lanzamiento

- [ ] **Asistente flotante Fase 2 (IA):** decidir con el equipo si se conecta Claude. Si si: instalar `@anthropic-ai/sdk`, crear `src/app/api/assistant/route.ts` (server, streaming) y `src/lib/assistant/systemPrompt.ts` (guardrails "amplio con limites" + contexto de `knowledge.ts`), agregar `ANTHROPIC_API_KEY` en Vercel (solo servidor) y cambiar el cuerpo de `getAssistantReply` en `src/lib/assistant/provider.ts` por un `fetch('/api/assistant')` con respaldo al bot de reglas. La UI no cambia.
- [ ] Recordatorios de citas por WhatsApp o correo.
- [ ] "Mi Expediente" con documentos privados y seguimiento.
- [ ] Backend de donaciones: casos, donantes, moderacion y Storage.
- [ ] Panel admin como mini-CRM: notas, asignacion y metricas.
- [ ] Permitir que un familiar gestione tramites por la persona con discapacidad.
- [ ] Auditoria WCAG 2.1 AA con lectores de pantalla y navegacion por teclado (prueba en runtime, no se cierra con analisis estatico).
  - [x] **Fase 3 contraste + calendario (2026-06-29):** en `BookingCalendar.tsx` los dias del calendario ahora llevan `aria-label` que dice por que no estan disponibles (fin de semana / dia suspendido / fecha pasada / disponible / seleccionado) y los horarios ocupados anuncian "horario ocupado"; dias deshabilitados subidos de `text-gray-300` a `text-gray-400` (suspendidos a `text-red-500`) para mejor legibilidad. Corregido contraste de texto significativo sobre fondo claro: divisor del login, etiquetas "(opcional)" de telefono/CURP, letra chica de registro y empty-states de cara al ciudadano (`gray-400` -> `gray-500/600`).
  - [ ] **Pendiente (cuidado, contexto-dependiente):** quedan ~50 usos de `text-gray-300/400` sin tocar a proposito porque son **iconos decorativos, placeholders, o texto claro sobre fondo OSCURO** (p. ej. `CuentaCTA` megafono, back-links de heroes) donde el gris claro es correcto. NO hacer un reemplazo global. Revisar uno por uno en la auditoria runtime + iconos interactivos (toggles de password ~2.8:1, idealmente 3:1).
- [ ] Analitica respetuosa de privacidad y SEO por pagina.

## 5. Registro de trabajo terminado

- [x] **Login con Google implementado en codigo (2026-07-10):** el boton "Iniciar sesion con Google" del login dejo de ser placeholder; usa `signInWithOAuth({provider:'google'})` con `redirectTo` al `/auth/callback` existente (que ya intercambia el codigo por sesion) y respeta el `redirectTo` seguro de la URL. El trigger `handle_new_user` ya crea el perfil (toma `full_name` de los metadatos de Google). **Falta lo MANUAL:** crear OAuth Client en Google Cloud (cuenta del diputado) con redirect URI `https://mmczynsmlfvkwrmmtapc.supabase.co/auth/v1/callback`, habilitar el proveedor Google en Supabase Auth con ese Client ID/Secret, y confirmar Site URL + Redirect URLs de Supabase Auth. Hacer push hasta que el proveedor este habilitado para no mostrar un boton que falla.

- [x] **Seccion de Iniciativas legislativas (2026-07-02):** nueva pagina `/iniciativas` fuera de la landing (enlazada en menu, footer y sitemap) con diseño editorial premium: hero tipografico gigante con rejilla de 3 columnas estilo revista, seccion informativa "¿Como nace una ley?" (5 pasos), lista de iniciativas con badge de estado (presentada/en comisiones/aprobada/publicada), acordeon "Leer mas" y enlace al documento oficial, y CTA amigable. Datos en Supabase: tabla `initiatives` (migracion `20260702_initiatives.sql` aplicada; RLS: publico solo lee publicadas, admin CRUD via `is_admin()`). Panel nuevo `/admin/iniciativas` para crear, editar, publicar/ocultar y borrar. Estado vacio honesto mientras no haya iniciativas reales.

- [x] **Cursor de sombrero + chispas naranjas al clic (2026-07-02):** el cursor por defecto ahora es el sombrero del emblema (`cursor-sombrero.png` 32px, solo con `pointer: fine`; enlaces y botones conservan la manita nativa como señal de "esto se pica"). Nuevo `ClickSpark` global (canvas `pointer-events: none`, chispitas naranja `#f97316` de 450ms al hacer clic, rAF solo mientras hay chispas vivas, sin efecto con `prefers-reduced-motion`).

- [x] **Responsivo: contenido recortado en celular (2026-07-02):** (1) Accesos directos: la altura fija del cuadro no alcanzaba en movil y las descripciones salian cortadas; ahora la altura es responsiva (840px movil / 760px >=480px / clamp original en sm+). (2) "¿Sabias que?": los 12 puntos del carrusel no se encogen y empujaban todo el contenedor fuera de pantalla (min-width:auto de flex); fix global `.landing-sheet > * { min-width: 0 }` + puntos con flex-wrap y gaps reducidos en movil. (3) `html { overflow-x: clip }` para que las animaciones de entrada laterales (FadeIn left/right) no ensanchen el documento. Verificado en 360, 390, 768 y 1440 px en home y todas las rutas publicas (docWidth = viewport, sin filas recortadas).

- [x] **Seccion de cuenta en colores de marca + reorden de navegacion (2026-07-02):** `CuentaCTA` dejo el fondo gris oscuro y ahora usa fondo `naranja-500` estilo "¿Sabias que?" (textos blancos, tarjetas blancas con borde naranja); solo cambiaron clases, la logica de sesion quedo intacta. Menu y landing reordenados en espejo: Como funciona -> Tramites -> Armando (con Instagram) -> Tu cuenta -> Ayudar; "¿Sabias que?" sigue cerrando la pagina.

- [x] **"Movimiento Ciudadano" del header con degradado animado (2026-07-02):** nuevo `GradientText` (React Bits adaptado a TS + framer-motion existente, paleta naranja de marca por defecto, `prefers-reduced-motion` deja el degradado fijo). Aplicado a la marca del partido en el Navbar (solo pantallas xl): 16px font-black sin el punto decorativo, degradado cafe-naranja oscuro -> naranja claro brillante en ciclo de 2.5s para que el barrido sea claramente visible.
- [x] **Fix flash de cuadros naranjas al abrir la home (2026-07-02):** en `Ballpit.jsx` los sombreros/aguilas arrancaban como planos naranjas solidos mientras cargaba su textura PNG. Ahora el material nace con `visible: false` y se muestra hasta que la textura esta lista; ya no se ven cuadros al cargar o refrescar.
- [x] **Sello "DIPUTADO FEDERAL" en las fotos del diputado:** `CircularText` (React Bits) adaptado a TS usando el `framer-motion` existente (sin instalar `motion`), sin `console.log`, respetando `prefers-reduced-motion`. Envuelto en `DiputadoFederalSeal` (solo letras blancas girando, sin fondo, con sombra sutil para legibilidad). Sobre la foto del hero (abajo-izquierda) y la de la biografia (abajo-derecha).
- [x] **Accesos directos: boton "?" con explicacion al lado del cuadro.** Nuevo `InfoHint` (boton "?" + globito por portal a `<body>`, cierra al tocar fuera/Escape/scroll). En `AyudaHoy` va en una columna al costado del `FlowingMenu`, un "?" por acceso alineado a su fila; funciona en celular y escritorio (resuelve que la franja hover no se ve sin cursor). El acceso sigue navegando.
- [x] **Header escritorio:** boton de inicio del `PillNav` mas grande (sombrero ~46px -> 58px) y convertido en pastilla con etiqueta visible **"Inicio"**; sigue girando en hover. Texto de marca del header reducido a solo **"Movimiento Ciudadano"**.
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
- [x] Menu movil (las 3 rayas, <1280px) ahora usa la animacion StaggeredMenu (React Bits) adaptada a marca: nuevo `src/components/ui/StaggeredMenu.tsx` + `.css`, capas naranjas en cascada, items con numeracion 01-04 y boton "Mi cuenta" abajo. Sin logo de React Bits, sin morados ni glassmorphism, `prefers-reduced-motion` respetado, overlay en portal a `<body>` para escapar del transform del header. Reemplaza el panel `AnimatePresence` anterior en `Navbar.tsx`; CSS muerto `.navbar-menu-button` retirado. Validado en movil y escritorio con capturas.
- [x] Reorganizacion de navegacion (header + menu de rayitas, mismo set): de explicador-centrico a destino-centrico. Nuevo menu: **Tramites** (#ayuda-hoy) · **Como funciona** (#como-funciona) · **Armando** (#armando-ruiz) · **Tu cuenta** (#crear-cuenta) · **Ayudar** (#donar). Asi los servicios (Salud, Tarjeta, Programas, Empleo) quedan a <=2 clics desde el menu y entran "crear cuenta" (megafono) y "ayudar" (sin lucro). Footer `infoLinks` actualizado en consecuencia.
- [x] Secciones "Atencion ciudadana" (`QuienesSomos`) y "Como te ayudamos" (`QueHacemos`) fusionadas en una sola: nuevo `src/components/sections/ComoTeAyudamos.tsx` (id `como-funciona`) con el "que/para que sirve + no damos becas, orientamos" y los 4 pasos. Se elimino la redundancia de los 3 "principios", el patron prohibido de franja lateral en hover y un guion largo en el copy. Borrados `QuienesSomos.tsx` y `QueHacemos.tsx`. Lint, tsc y capturas OK.
- [x] Asistente flotante global (estilo Messenger) en todas las paginas: burbuja con ojitos que siguen el mouse y el sombrero del favicon "puesto" como emblema, con rebote/brinco al picarla (respeta `prefers-reduced-motion`). Panel de chat naranja accesible (dialog, Esc, foco, `aria-live`), solo texto (sin adjuntar ni voz), reutiliza `knowledge.ts` via `AnswerCard` compartido. Sin IA por ahora, con enchufe listo en `src/lib/assistant/provider.ts` para Fase 2. Archivos: `src/components/assistant/{FloatingAssistant,EyesBubble,AnswerCard}.tsx`, montado en `src/app/layout.tsx`. Lint y build OK.
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
- [x] Header/navbar reconstruido en local sin el bloque grande `AR / Armando Ruiz / Diputado Federal`.
- [x] Landing preparada en local para nueva fase visual: se retiro la seccion `Rutas de apoyo` y se conservan accesos directos.
- [x] React Bits CardSwap instalado via shadcn, convertido a TSX/Tailwind en `src/components/CardSwap.tsx`, integrado en hero y validado con lint/build local.
- [x] Secciones Instagram y Donar liberadas del alto fijo de `landing-sheet` para que el contenido no se corte y pueda crecer segun lo necesite.
- [x] Accesos directos adaptados con React Bits FlowingMenu, imagenes locales por tramite y ajuste responsivo para mostrar las seis opciones.
- [x] FlowingMenu de accesos directos refinado: texto sin encimarse e imagenes simplificadas a iconos claros por servicio.
- [x] Login ajustado para que los errores no se recorten, con scroll interno y acciones claras para restablecer contrasena o registrarse.
- [x] Fechas de agenda/admin corregidas para usar dia de Ciudad de Mexico y evitar desfases por UTC.
- [x] Solicitudes internas movidas a `/api/contact-requests` con validacion server-side, honeypot y rate limit basico.
- [x] Consultas de citas/solicitudes reducidas para evitar `select("*")` en superficies cliente/admin.
- [x] Migracion `20260623_production_hardening.sql` agregada: grants explicitos, helpers privados, politica RLS de cancelacion ciudadana y columna `appointments.topic`.
- [x] Tipografia principal cambiada a Atkinson Hyperlegible y hero refinado para mostrar acciones en primera pantalla movil.
- [x] Checklist de produccion agregado en `PRODUCCION.md`.
- [x] Header refinado: PillNav centrado en el header, sombrero/logo ~40% mas grande y mas separacion entre pestañas.
- [x] CardSwap del hero ya no se pausa al pasar el cursor; cambia cada 1.5s con animacion `smooth` ajustada para que cada recorrido quepa dentro del intervalo.
- [x] Sombrero de la burbuja del asistente 50% mas grande.
- [x] Instagram del diputado actualizado al handle real `@armandoruizmc` (carrusel, texto, boton de perfil y footer).
- [x] Copy corregido: titulo del hero solo "Por un México más Accesible", subtitulo "Diputado Federal por el Estado de México"; programas/empleo sin restringir a CDMX; "Empleo Inclusivo" -> "Empleo Accesible".
- [x] Modal de solicitudes internas (`InternalRequestButton`) con alto maximo, scroll interno y cierre al tocar el fondo para que no se salga de pantalla en formularios largos.
- [x] **BUG resuelto:** el modal de `InternalRequestButton` parpadeaba/congelaba al abrir (en Donar y demas paginas). Causa: el overlay `position: fixed` se renderizaba dentro de una tarjeta animada de Framer Motion (`StaggerItem` con `transform`), lo que cambiaba su bloque contenedor, y Lenis seguia corriendo su loop peleando con el overlay. Solucion: el modal ahora se monta con `createPortal` en `document.body`, se pausa Lenis (`lenisStop`/`lenisStart` nuevos en `SmoothScrollProvider`) mientras esta abierto y el foco inicial usa `preventScroll`.
- [x] Seccion Donar lista para produccion sin datos falsos: removidos los 4 casos inventados y la estructura `Causa`; en su lugar dos tarjetas claras "Quiero ofrecer ayuda" (donation) y "Necesito ayuda / Pedir ayuda" (general). Lint y build de produccion OK.
- [x] **Asistente flotante (bot) recargado y mejorado:** knowledge.ts actualizado (pension nacional $3,300 bimestrales/Bienestar, programas reales + "orientamos no otorgamos", bolsa honesta + Abriendo Espacios, Beca Benito Juarez, nueva respuesta "cuenta" + keywords registro/login/perfil, megafono, "Mi perfil"). Saludo del asistente y preguntas rapidas actualizados (incluye "Como creo mi cuenta?"). EyesBubble: sombrero +50% (75x60 -> 112x90, wrapper -top-[54px]); animacion de saludo del sombrero cada 3s (venia 0.8s + pausa 2.2s); signo "?" animado que aparece cada 10s (duda); SIN animacion cuando el panel esta abierto; respeta prefers-reduced-motion. Chat: texto con overflow-wrap/break-words para que no se corte. Lint y build OK.
- [x] **Cuenta como columna vertebral + mensaje "megafono":** nueva seccion `CuentaCTA` (src/components/sections/) en la landing (despues de QueHacemos, id="crear-cuenta"). Es auth-aware (mismo patron que AccountButton): sin sesion muestra publicidad "crea tu cuenta gratis" con beneficios (agenda citas en linea/presencial, seguimiento de tramites/solicitudes de salud) + 3 pasos de como crearla + CTAs Crear cuenta / Ya tengo cuenta; con sesion cambia a "ya tienes tu cuenta, {nombre}" con CTAs Agendar cita / Mi perfil. Mensaje de megafono ("El equipo de Armando es tu megafono... tu voz se potencia mil veces y sera escuchada"). Copy de /auth/login y /auth/registro pasado al tono amigable. Lint y build OK.
- [x] **Tono amigable (estilo Derbez, de "tu"):** guia de voz agregada en PRODUCT.md (calido/esperanzador, nunca brusco, claridad que invita a entrar con poco texto, lineas rojas en legal/medico). Reescritas: Hero, AyudaHoy (+6 tarjetas), QuienesSomos (+3 principios), QueHacemos (4 pasos), QuienEsArmando, SabiasQue (intro; datos serios intactos), Instagram, y subtitulos de tarjeta-accesible/salud/secretarias/aliados. PENDIENTE: header con desplegable "Tramites y servicios" (Parte C del plan); revisar CDMX vs Edomex en tarjeta/salud/secretarias (contenido CDMX real, decidir si se suma equivalente Edomex). Lint y build OK.
- [x] **Hero: las "bolitas" ahora son águilas del emblema (pedido del diputado).** `Ballpit.jsx` ya no dibuja esferas con material físico/envmap/luces; cada cuerpo es un `PlaneGeometry` con `MeshBasicMaterial` (map = textura del emblema, `transparent`, `alphaTest: 0.5`, `depthWrite: false`, `DoubleSide`). Se conserva intacto el motor de física (`BallPhysics`: caen, rebotan, chocan, se empujan con el cursor). Se cargó la textura con `TextureLoader` y se ajusta el aspecto real (`geometry.scale`) para que no salga estirada; inclinación sutil según velocidad horizontal ("planean"). Quitados envmap/PMREM/RoomEnvironment/luces/`setColors` → **más ligero**. Nuevo prop `texture` en `Ballpit`. `Hero.tsx`: pasa `texture="/images/emblema-aguila.png"`, baja `count` a 26, sube tamaños, opacidad 0.45/0.55; quitados props de color/material/luz y la constante `heroBallpitColors`. Respeta `prefers-reduced-motion` (wrapper `motion-reduce:hidden`). Lint OK, compila OK. **Assets ya colocados:** `public/images/emblema-aguila.png` (águila oficial naranja de Movimiento Ciudadano que dio David, optimizada a 600x240, 18KB) y `public/images/sombrerito.png` (recorte del sombrero del diputado: se le quitó el fondo blanco con flood-fill desde bordes a partir de `~/Downloads/emblema sombrero.png`, 320x184 transparente). **Águilas + sombreritos UNIFICADOS en un solo Ballpit / un solo contexto WebGL** (antes eran dos canvas y daba ~10fps). `BallMesh` ahora extiende `Group` y acepta `layers` (`[{texture,count,minSize,maxSize}]`): un `InstancedMesh` por textura, pero comparten UNA física y UN rAF. `Hero.tsx` usa `layers` con águila (26) + sombrero (16), opacidad 0.66/0.74, `cursorRadius:1`. **Fix del "alcance al doble":** la geometría pasó a `PlaneGeometry(2,2)` para que la mitad visible (=tamaño) coincida con el radio de colisión; por eso los tamaños en Hero se bajaron a la mitad (0.45–0.85 / 0.45–0.78) y se ven igual de chicos pero ya no chocan al doble de su tamaño. `frustumCulled=false` por instancia. Respeta `prefers-reduced-motion`.
- [x] **Botón "?" de Accesos directos: animación cascabel + copy más amigable.** En `InfoHint` (sección AyudaHoy) el botón "?" ahora repica como cascabel cada ~3.6s (keyframes `info-hint-cascabel`, `transform-origin: 50% 0` para colgar como campanita); se detiene en hover/foco y con el globito abierto (clase `info-hint-btn--open`); respeta `prefers-reduced-motion`. Reescritos los 6 textos `info` de `AyudaHoy.tsx` a un tono más cálido, directo y de "tú" (sencillo pero con respeto). `next.config.ts` ahora tiene `distDir: ".next.nosync"` para que iCloud no genere copias de conflicto que rompían la compilación. Lint OK.
- [x] **Hero: sombrero reducido + sin desvanecido por scroll.** Sombrero bajado ~250% (de 336/408px a 140px movil / 168px sm) y aguilita reescalada acorde (h-12/h-14). Removido el efecto que desvanecia el contenido del hero al hacer scroll (`opacity = useTransform(scrollY, [0,420], [1,0])`) porque en algunos dispositivos el texto quedaba ilegible al bajar; se conserva el parallax suave (`y`). Lint OK.
- [x] **Sombrero del hero: sin sonido + emblema gigante animado.** Removido por completo el acorde de Web Audio (`playChime`/`audioCtxRef`) en `SombreroAguila.tsx`: al picarlo ya NO suena, la aguilita sale solo con animacion. El sombrero crecio ~500% (de 56/68px a 336px movil / 408px sm) como sello/esencia de la pagina, con animacion viva continua (flota y se mece, `y` ±14 + `rotate` ±3°, transformOrigin bottom center). Aguilita reescalada acorde (h-28/h-32). Respeta `prefers-reduced-motion`. Comentario del Hero actualizado (sin "musiquita"). Lint OK.
- [x] **Apuntes del diputado (Parte 5 - sombrero + aguilita):** nuevo `SombreroAguila` (src/components/effects/) montado en el hero junto al titulo "Por un Mexico mas Accesible". Usa public/images/sombrero.png; al picarlo sale una aguilita (SVG silueta propia, no el logo registrado) con resorte + acorde corto generado con Web Audio (solo AL PICAR, nunca autoplay; el jingle real se puede sustituir). Respeta prefers-reduced-motion. Lint y build OK. Las "bolitas" (Ballpit del hero) se ATENUARON (count 101->42, opacidad 0.7/0.8 -> 0.32/0.42) para que el sombrero destaque.
- [x] **Apuntes del diputado (Parte 4 - bolsa de trabajo):** removidas las 6 vacantes inventadas (empresas/sueldos ficticios). Hero reformulado: "El Diputado no contrata ni garantiza el empleo: publica las vacantes y te conecta". Aviso "la informacion de cada vacante es otorgada por la empresa que la publica". Estado honesto "por ahora no hay vacantes publicadas" + boton "Dejar mi perfil" + enlace a bolsa nacional real Abriendo Espacios (STPS). CTA de empresas conservado. Lint y build OK.
- [x] **Apuntes del diputado (Parte 3 - programas sociales):** reemplazados los 6 programas con datos/montos inventados por 5 programas REALES verificados contra fuentes oficiales, cada uno con institucion responsable, alcance (Nacional/Edomex/CDMX) y boton "Ir al sitio oficial para tramitar" (link real, target _blank). Cobertura nacional + ambos estados. Aviso destacado "estos apoyos los otorgan las autoridades, no nosotros". Programas: Pension Bienestar Discapacidad ($3,300 bimestrales, gob.mx), Beca Benito Juarez (gob.mx/becasbenitojuarez), Abriendo Espacios STPS, DIF Edomex (difem.edomex.gob.mx), INDISCAPACIDAD CDMX. Lint y build OK.
- [x] **Apuntes del diputado (Parte 2 - mensaje/posicionamiento):** slogan "Discapacidad con dignidad" en el hero + descripcion mas clara; bloque en QuienesSomos que responde "para que sirve esta pagina" y aclara "No damos becas ni regalamos apoyos... las autoridades otorgan, nosotros orientamos y conectamos". Corregido "en CDMX" -> "Estado de Mexico" en QuienEsArmando y footer "Ciudad de Mexico" -> "Mexico". PENDIENTE DE DECISION: casi todo el contenido de servicios (Tarjeta Accesible, programas, salud, bolsa) esta armado para CDMX pero su jurisdiccion es Edomex; definir cobertura real antes de Parte 3.
- [x] **Apuntes del diputado (Parte 1 - login/perfil):** "Mi cuenta" -> "Mi perfil" en toda la UI. Nuevo `AccountButton` (cliente) en navbar: sin sesion muestra "Iniciar sesion"; con sesion muestra foto (avatar_url de Google o iniciales) + nombre y enlaza a /mi-cuenta con aria "aqui gestionas tu cuenta y tus citas". Encabezado de /mi-cuenta rediseñado con avatar + nombre + nota de gestion. Ruta /mi-cuenta se conserva. Lint y build OK.
