import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rutas privadas o sin valor para buscadores
      disallow: ["/admin/", "/mi-cuenta", "/auth/", "/api/"],
    },
    sitemap: "https://www.armandoruizmc.com/sitemap.xml",
  };
}
