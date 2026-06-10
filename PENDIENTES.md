# 📋 PENDIENTES — Portal Diputado Armando Ruiz

> **Nota viva del proyecto.** Aquí registramos TODO lo que falta para dejar el portal
> impecable. Claude consulta y actualiza este archivo en cada sesión.
> Marca `[x]` lo completado. Última actualización: **2026-06-08**.

---

## 🔴 CRÍTICO — Legal y datos que solo David / el equipo pueden llenar

### Aviso de Privacidad (`/aviso-privacidad`) — ya creado como BORRADOR
- [ ] Completar placeholders: **[NOMBRE LEGAL DEL RESPONSABLE]**, **[DOMICILIO]**, **[CORREO DE PRIVACIDAD]**, **[TELÉFONO]**, **[FECHA]**, **[URL DEL SITIO]**.
- [ ] **Revisión y aprobación por área jurídica** antes de publicar (recaban datos sensibles de salud → consentimiento expreso obligatorio).
- [ ] Definir transferencias reales de datos (apartado 7) y uso real de cookies (apartado 8).
- [ ] Quitar el banner amarillo de "borrador" una vez aprobado.

### Página de Accesibilidad (`/accesibilidad`) — ✅ creada (Declaración de Accesibilidad)
- [ ] Reemplazar correo placeholder del botón "Reportar un problema" por el real (ver `// TODO`).

---

## 🟠 FUNCIONALIDAD pendiente

- [ ] **Recordatorios por WhatsApp** de las citas (lo que más sube la asistencia con este público).
- [ ] **"Mi Expediente"**: permitir subir documentos (INE, recetas, dictámenes) y darles seguimiento, no solo ver citas.
- [ ] **Home como lanzador de tareas** ("¿En qué te ayudamos hoy?") en lugar de scroll largo — estilo navegación Metro CDMX.
- [ ] (Opcional) Selector de **tema** al agendar: Salud / Apoyo a discapacidad (hoy solo "salud").
- [ ] Reemplazar `prompt()`/`confirm()`/`alert()` del panel admin y de Mi Cuenta por modales accesibles y on-brand.
- [ ] Probar de punta a punta el flujo de **modalidad** (presencial / en línea + enlace de videollamada) ahora que la migración ya se aplicó.

---

## 🟡 CONTENIDO REAL pendiente (reemplazar placeholders)

### Sección Donar / Causas
- [ ] **Correo o WhatsApp real del equipo** (hoy placeholder `contacto@armandoruiz.mx`) — ver `// TODO` en `Donar.tsx`.
- [ ] Casos/causas reales (hoy 4 de ejemplo: Luis, Mariana, José, Valeria).
- [ ] **Fotos + consentimiento firmado** del beneficiario/tutor antes de mostrar nombre y foto reales.
- [ ] Costos reales de cada necesidad.

### Identidad y contacto
- [ ] **Foto oficial de Armando** (hoy avatar con iniciales "AR" en Hero y QuienEsArmando).
- [ ] **Footer**: teléfono real (hoy `(55) 5555-5555`), correo real, **domicilio real** de la oficina (hoy "Cámara de Diputados" genérico).
- [ ] **Redes sociales del footer**: apuntan a `instagram.com` / `facebook.com` / `twitter.com` genéricos → poner URLs reales.
- [ ] **Instagram**: configurar token/API real (hoy muestra placeholders) para `@armandoruizdiputado`.

---

## 🚀 GIT / DEPLOY pendientes

- [ ] **Reapuntar `origin`** al repo nuevo (hoy: `github.com/davidbello0203-crypto/Armando-Ruiz` → cuenta vieja). **Falta la URL del repo nuevo.**
- [ ] **Configurar identidad de git** (nombre + correo de la cuenta nueva) — hoy no hay ninguna y un commit fallaría.
- [ ] Primer **commit + push** de todo el trabajo (17+ archivos) al repo nuevo.
- [ ] **Vercel**: confirmar variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la cuenta nueva.
- [ ] **Dominio propio** (no `.vercel.app`).
- [ ] ✅ `.env.local` está en `.gitignore` y NO se sube (verificado 2026-06-08).

---

## ✅ HECHO (registro)

- [x] Coherencia visual de la home: ritmo de fondos, colores de texto, highlights unificados (`.text-highlight`), radios/bordes, orden menú = orden visual. *(2026-06-07)*
- [x] Rediseño sección **Donar** → modelo de conexión directa (no maneja dinero), tablón de causas + transparencia + cómo funciona. *(2026-06-07)*
- [x] **Sistema de citas profesionalizado** *(2026-06-08)*:
  - Horario unificado a **9:00–17:00** (antes había 3 valores distintos).
  - Accesibilidad: calendario y horarios más grandes para público mayor/baja visión.
  - **Modalidad presencial / en línea** completa: selector al agendar, badge + campo de enlace de videollamada en panel admin, botón "Unirse a la videollamada" en Mi Cuenta.
  - Migración Supabase aplicada (`modality`, `meeting_link`).
- [x] **Aviso de Privacidad** creado como borrador LFPDPPP (`/aviso-privacidad`) — arregla enlace roto del footer. *(2026-06-08)*
- [x] **Página de Accesibilidad** creada (`/accesibilidad`, Declaración de Accesibilidad) — arregla el otro enlace roto del footer. *(2026-06-08)*

---

## 🎯 ROADMAP PROFESIONAL (visión a futuro)

- [ ] **Accesibilidad bandera**: certificación WCAG 2.1 AA, barra de accesibilidad (texto más grande, alto contraste), lectura fácil, videos en LSM.
- [ ] **Credibilidad / resultados**: sección con números reales (personas apoyadas, trámites gestionados, iniciativas).
- [ ] **Panel admin como mini-CRM**: notas internas, asignación, métricas (citas que entran/resuelven, tiempo promedio).
- [ ] Permitir que **un familiar gestione** por la persona con discapacidad.
- [ ] SEO/metadata por página, analítica, optimización de imágenes.
