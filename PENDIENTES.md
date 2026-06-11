# 📋 PENDIENTES — Portal Diputado Armando Ruiz

> **Nota viva del proyecto.** Aquí registramos TODO lo que falta para dejar el portal
> impecable. Claude consulta y actualiza este archivo en cada sesión.
> Marca `[x]` lo completado. Última actualización: **2026-06-10 (noche, pre-lanzamiento)**.

---

## 🚀 CHECKLIST DE LANZAMIENTO (mañana) — lo que falta para salir en vivo

> El código está **listo y verificado** (build de producción sin errores, 20 rutas).
> Lo que sigue es configuración de cuentas (David dijo: "al ratito"):

1. [ ] **Comprar dominio `armandoruizmc.com`** (ya está en el carrito de Vercel, cuenta del diputado).
2. [ ] **Vercel**: importar el repo `armandosupabaseruiz02-gif/Armandoruizmc.com` como proyecto (cuenta del diputado).
3. [ ] **Vercel → Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copiar de `.env.local`).
4. [ ] **Vercel → Domains**: conectar `armandoruizmc.com` al proyecto.
5. [ ] **Supabase → Auth → URL Configuration**: Site URL = `https://armandoruizmc.com` y Redirect URLs con `/auth/callback`. ⚠️ Sin esto el login NO funciona en producción.
6. [ ] Prueba final en producción: registro → login → agendar cita → verla en Mi Cuenta → gestionarla en admin.

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
- [x] Reemplazar `prompt()`/`confirm()`/`alert()` por **modales accesibles** on-brand (`ConfirmDialog.tsx`) en admin y Mi Cuenta. *(2026-06-10)*
- [ ] Probar de punta a punta el flujo de **modalidad** (presencial / en línea + enlace de videollamada) ahora que la migración ya se aplicó.
- [ ] **Decisión post-lanzamiento** (de los apuntes de Obsidian): el spec dice que las citas deberían quedar `pendiente` hasta que el admin las **acepte/rechace**; hoy se auto-confirman. Cambiarlo requiere migración de BD + ajuste de flujos — decidir con calma, no el día del lanzamiento.
- [ ] **Animación del sombrero ranchero naranja** (sello de marca del diputado) — esperando la foto que enviará David.

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

- [x] **Repo nuevo conectado**: `origin` → `github.com/armandosupabaseruiz02-gif/Armandoruizmc.com`. *(2026-06-10)*
- [x] **Identidad de git** configurada (Armando Ruiz MC / armandosupabaseruiz02@gmail.com). *(2026-06-10)*
- [x] **Primer commit + push** al repo nuevo (commit `52749d2`, 20 archivos). Credencial guardada en llavero → próximos push automáticos. *(2026-06-10)*
- [ ] **Vercel**: conectar el repo nuevo y confirmar variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la cuenta nueva.
- [ ] **Dominio propio** (no `.vercel.app`).
- [x] ✅ `.env.local` está en `.gitignore` y NO se sube (verificado 2026-06-08).

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
- [x] **Pase pre-lanzamiento** *(2026-06-10)*: build de producción sin errores (20 rutas); auditoría de enlaces internos (todos válidos); fix `/api/instagram` (500 → 200 con data vacía); SEO con dominio final (`metadataBase`, canonical, `robots.txt`, `sitemap.xml` con `armandoruizmc.com`); footer con Instagram real (`@armandoruizdiputado`) y FB/Twitter retirados hasta tener URLs reales; modales accesibles `ConfirmDialog` reemplazando `prompt()/confirm()` nativos.

---

## 🎯 ROADMAP PROFESIONAL (visión a futuro)

- [ ] **Accesibilidad bandera**: certificación WCAG 2.1 AA, barra de accesibilidad (texto más grande, alto contraste), lectura fácil, videos en LSM.
- [ ] **Credibilidad / resultados**: sección con números reales (personas apoyadas, trámites gestionados, iniciativas).
- [ ] **Panel admin como mini-CRM**: notas internas, asignación, métricas (citas que entran/resuelven, tiempo promedio).
- [ ] Permitir que **un familiar gestione** por la persona con discapacidad.
- [ ] SEO/metadata por página, analítica, optimización de imágenes.
