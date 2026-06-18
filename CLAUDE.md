# CLAUDE.md — Portal Diputado Armando Ruiz

> Contexto para cualquier agente que trabaje en este repo. Léelo completo antes de tocar nada.
> **Fuentes de verdad vivas:** `PENDIENTES.md` (estado/tareas) y `PRODUCT.md` (marca, tono, accesibilidad). Léelas también.
> Documentación extendida (humana) en la bóveda Obsidian de David: `~/Documents/Obsidian Vault/🌐 Proyectos/🏛️ Diputado Armando Ruiz/`.

## Qué es este proyecto
Portal web **oficial** del **Diputado Armando Ruiz** (Cámara de Diputados, CDMX, partido **Movimiento Naranja**). Es la **"casa de apoyo" del diputado, pero virtual**: ofrece en línea los servicios de una casa de gestión (becas, apoyos, donaciones, trámites), **priorizando asesoría y trámites de SALUD** para **personas con discapacidad** y sus familias. El diputado usa silla de ruedas y es portavoz de la discapacidad. **La accesibilidad es la razón de existir del sitio, no un extra.**

## ⛔ Reglas duras (no romper)
1. **NO empezar de cero.** Ya hay mucho construido. Reutiliza componentes y patrones existentes; construye SOBRE lo que hay.
2. **Accesibilidad innegociable:** WCAG AA+ (idealmente AAA en texto), fuente Atkinson Hyperlegible, navegación por teclado, lectores de pantalla, `prefers-reduced-motion`, touch targets ≥56px, contraste alto, alt text. Funciona en celular de gama baja.
3. **Cuentas separadas a propósito** (David le vendió la propiedad; solo da mantenimiento):
   - GitHub del diputado: `armandosupabaseruiz02-gif` → repo `Armandoruizmc.com`.
   - Vercel: cuenta propia del diputado (NO la personal de David `davidbellocrypto`).
   - El `origin` local apunta al repo oficial del diputado: `https://github.com/armandosupabaseruiz02-gif/Armandoruizmc.com.git`.
4. **Dominio primero:** dominio definitivo = **`armandoruizmc.com`**. Configura Supabase Auth (Site URL + Redirect URLs), env vars y correos con ESE dominio.
5. **Marca:** naranja `#FF6B00` cálido; nunca azules fríos, gradientes morado-azul ni glassmorphism. Tono claro, humano, español neutro mexicano, CTAs que nombran lo que se obtiene. Detalle en `PRODUCT.md`.
6. **Datos sensibles de salud:** Aviso de Privacidad (LFPDPPP) debe estar aprobado por jurídico antes de publicar; mostrar nombre/foto de beneficiarios/donantes requiere consentimiento firmado.

## Identidad visual pendiente
- El diputado **siempre usa un sombrero tipo ranchero color naranja** → se quiere una **animación del sombrero** como sello/esencia de la página (respetando `prefers-reduced-motion`). David enviará foto.

## Stack
Next.js (App Router) + TypeScript · Tailwind · Framer Motion · Lenis (smooth scroll) · Lucide · Embla (carrusel) · **Supabase** (`@supabase/ssr`: Auth + Postgres + Storage) · Instagram Graph API · Deploy en Vercel.

Comandos: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

## Mapa del código (rutas reales)
- **Home** `src/app/page.tsx` → secciones en `src/components/sections/` (Hero, Servicios, QuienesSomos, QueHacemos, QuienEsArmando, SabiasQue, Instagram, Donar).
- **Salud / citas:** `src/app/salud/`, `src/app/salud/agendar/` (BookingCalendar). Citas con **modalidad presencial/en línea** + `meeting_link`; horario 9:00–17:00.
- **Cuentas:** `src/app/auth/{login,registro,callback}`, `src/app/mi-cuenta/` (UserDashboard).
- **Admin:** `src/app/admin/citas/` (AdminPanel) — aceptar/rechazar citas, agregar enlace de videollamada.
- **Otras páginas:** `tarjeta-accesible`, `programas-sociales`, `bolsa-trabajo`, `secretarias`, `aliados`, `aviso-privacidad`, `accesibilidad`.
- **Supabase:** `src/lib/supabase/{client,server,middleware}.ts`.
- **Skill instalada:** `.claude/skills/impeccable/` (revisión de UI/UX — anti-patrones, accesibilidad).

## Módulos clave (visión de producto)
1. **Citas y Asesorías (salud)** — CORE. Agendar presencial/en línea, el admin acepta.
2. **Donación con perfiles** — un beneficiario sube su perfil/necesidad; un donante ayuda **directo**; el sitio muestra **historial público** de ayudados + donantes (con consentimiento). El sitio **no maneja dinero** (conexión directa).
3. **Panel admin** — gestiona citas y modera perfiles de donación; va hacia mini-CRM.

## Estado y pendientes
Ver **`PENDIENTES.md`** (nota viva, actualízala al hacer cambios). Estado actual: GitHub, Vercel y dominio `armandoruizmc.com` ya están conectados en cuentas del diputado; Supabase Auth ya recibe registro, confirmación por correo y login en producción; Resend ya verificó el dominio y Custom SMTP quedó configurado manualmente. Prioridad inmediata: agregar `RESEND_API_KEY` y `APPOINTMENTS_ADMIN_EMAIL` en Vercel, ejecutar la migración `20260618_appointment_email_notifications.sql`, probar correos de citas, asegurar Redirect URLs de Supabase Auth, completar Aviso de Privacidad + revisión jurídica, contenido real (foto del diputado, contacto del footer, token de Instagram, casos reales de Donar), recordatorios por WhatsApp y "Mi Expediente" (subir documentos).

## Al terminar un cambio
- Actualiza `PENDIENTES.md` (marca `[x]` lo hecho, agrega lo nuevo).
- David lleva además una bitácora humana en Obsidian (`Bitácora — Diputado Armando Ruiz.md`); si trabajas con él, conviene que registre ahí el cambio con fecha.
