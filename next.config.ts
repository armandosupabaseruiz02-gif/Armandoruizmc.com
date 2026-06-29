import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El proyecto vive en ~/Desktop, que iCloud sincroniza. iCloud generaba
  // copias de conflicto (" 2.ts") dentro de la carpeta de build y rompian la
  // compilacion con errores "Duplicate identifier". Escribimos el build en una
  // carpeta con sufijo .nosync, que iCloud ignora por completo.
  distDir: ".next.nosync",
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
};

export default nextConfig;
