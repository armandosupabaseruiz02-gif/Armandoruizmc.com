import type { MetadataRoute } from "next";

const BASE = "https://www.armandoruizmc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas: { path: string; priority: number }[] = [
    { path: "/",                   priority: 1 },
    { path: "/salud",              priority: 0.9 },  // rubro CORE del portal
    { path: "/tarjeta-accesible",  priority: 0.9 },
    { path: "/iniciativas",        priority: 0.8 },
    { path: "/programas-sociales", priority: 0.7 },
    { path: "/bolsa-trabajo",      priority: 0.7 },
    { path: "/secretarias",        priority: 0.6 },
    { path: "/aliados",            priority: 0.6 },
    { path: "/aviso-privacidad",   priority: 0.3 },
    { path: "/accesibilidad",      priority: 0.3 },
  ];

  return rutas.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
