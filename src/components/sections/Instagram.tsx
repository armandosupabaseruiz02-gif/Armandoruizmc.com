"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { Instagram, Play, ExternalLink } from "lucide-react";
import type { InstagramPost } from "@/app/api/instagram/route";

const PLACEHOLDER_COUNT = 8; // suficientes para que el carrete llene pantallas anchas

/* ——— Card de un reel real ——— */
function ReelCard({ post, tabbable }: { post: InstagramPost; tabbable: boolean }) {
  const isVideo = post.media_type === "VIDEO";
  const thumb   = isVideo ? post.thumbnail_url : post.media_url;
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabbable ? undefined : -1}
      className="relative block w-[200px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden
                 border-2 border-naranja-100 cursor-pointer group shadow-card flex-shrink-0
                 transition-transform duration-300 hover:scale-[1.04] hover:-translate-y-1"
      aria-label={post.caption
        ? `Ver publicación: ${post.caption.slice(0, 60)}…`
        : "Ver publicación en Instagram"}
    >
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={post.caption?.slice(0, 80) ?? "Publicación de Instagram"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md
                          group-hover:scale-110 transition-transform duration-200">
            <Play className="w-6 h-6 text-naranja-600 ml-1" fill="currentColor" aria-hidden="true" />
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center">
          <ExternalLink className="w-3.5 h-3.5 text-naranja-600" aria-hidden="true" />
        </div>
      </div>
      <div className="absolute top-3 left-3" aria-hidden="true">
        <div className="w-7 h-7 rounded-lg bg-naranja-500 flex items-center justify-center">
          <Instagram className="w-4 h-4 text-white" />
        </div>
      </div>
    </a>
  );
}

/* ——— Card placeholder (mientras no hay token de Instagram) ——— */
function PlaceholderCard() {
  return (
    <div className="relative w-[200px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden
                    border-2 border-naranja-100 shadow-card flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-naranja-50 to-naranja-100" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Instagram className="w-10 h-10 text-naranja-300" aria-hidden="true" />
      </div>
      <div className="absolute top-3 right-3" aria-hidden="true">
        <div className="w-7 h-7 rounded-lg bg-naranja-500 flex items-center justify-center">
          <Instagram className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function InstagramReels() {
  const [posts, setPosts]     = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.length) {
          setPosts(data.data);
          setReady(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Si hay pocos posts, se duplican para que el carrete llene el ancho sin huecos
  const display = ready && posts.length > 0 && posts.length < 6 ? [...posts, ...posts] : posts;

  /* Render de una "mitad" del carrete (el bucle usa dos mitades idénticas) */
  const renderHalf = (clone: boolean) => (
    <div
      className={`flex gap-4 pr-4 ${clone ? "marquee-clone" : ""}`}
      aria-hidden={clone || undefined}
    >
      {!ready
        ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <PlaceholderCard key={i} />
          ))
        : display.map((post, i) => (
            <ReelCard key={`${post.id}-${i}`} post={post} tabbable={!clone} />
          ))}
    </div>
  );

  return (
    <section
      id="instagram"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="instagram-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-16">
          <span className="section-badge-light">Instagram</span>
          <h2
            id="instagram-titulo"
            className="text-[40px] sm:text-[52px] font-black text-gray-900
                       leading-tight tracking-tight mt-5 mb-5"
          >
            Síguenos en{" "}
            <span className="text-highlight">Instagram</span>
          </h2>
          <p className="text-[18px] text-gray-800 max-w-xl mx-auto leading-relaxed">
            Mira nuestros últimos videos y mantente informado de todo lo que hacemos por las personas con discapacidad.
          </p>
          <p className="text-naranja-600 text-[15px] font-bold mt-2">@armandoruizdiputado</p>
        </FadeIn>
      </div>

      {/* ——— CARRETE INFINITO ———
          A ancho completo, avanza solo; se pausa con el mouse o el teclado.
          Con prefers-reduced-motion queda como carrusel de scroll manual. */}
      <FadeIn>
        {loading ? (
          /* Skeletons mientras carga */
          <div className="flex gap-4 px-5 sm:px-8 overflow-hidden" aria-hidden="true">
            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div key={i} className="w-[200px] sm:w-[240px] aspect-[9/16] rounded-2xl bg-naranja-50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div
            className="marquee-mask pb-4"
            role="region"
            aria-label="Carrusel de publicaciones de Instagram de Armando Ruiz (se pausa al pasar el cursor)"
          >
            <div className="marquee-track">
              {renderHalf(false)}
              {renderHalf(true)}
            </div>
          </div>
        )}
      </FadeIn>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mt-10">
          <a
            href="https://www.instagram.com/armandoruizdiputado"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
            aria-label="Ver perfil completo en Instagram (abre en nueva pestaña)"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
            Ver perfil en Instagram
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
