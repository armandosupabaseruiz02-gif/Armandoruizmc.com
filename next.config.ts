import type { NextConfig } from "next";

// Content-Security-Policy. Permisiva en script/style (Next.js inyecta scripts y
// estilos inline durante la hidratacion; sin nonce hace falta 'unsafe-inline'),
// pero acotada en las fuentes que de verdad usamos: Supabase (API/Auth/Realtime),
// imagenes de Instagram y avatares de Google. Si tras desplegar la consola del
// navegador reporta un host bloqueado, basta con agregarlo aqui (img-src/connect-src).
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.cdninstagram.com https://*.instagram.com https://lh3.googleusercontent.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Fuerza HTTPS por 2 años, incluye subdominios y habilita preload.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Anti-clickjacking (coherente con frame-ancestors 'none').
  { key: "X-Frame-Options", value: "DENY" },
  // Evita que el navegador "adivine" tipos MIME.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No filtrar la ruta completa al navegar a otros sitios.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El sitio no usa camara/microfono/geolocalizacion (las videollamadas son enlaces externos).
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // El proyecto vive en ~/Desktop, que iCloud sincroniza. iCloud generaba
  // copias de conflicto (" 2.ts") dentro de la carpeta de build y rompian la
  // compilacion LOCAL con errores "Duplicate identifier". Por eso en local
  // escribimos el build en una carpeta con sufijo .nosync, que iCloud ignora.
  // PERO en Vercel el output debe ser el ".next" por defecto: si usamos
  // .next.nosync alla, Vercel no encuentra routes-manifest.json y el deploy
  // FALLA. Por eso el sufijo solo aplica fuera de Vercel.
  distDir: process.env.VERCEL ? ".next" : ".next.nosync",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.instagram.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
