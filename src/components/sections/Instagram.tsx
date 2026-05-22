"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Instagram, Play, ExternalLink } from "lucide-react";
import type { InstagramPost } from "@/app/api/instagram/route";

const PLACEHOLDER_COUNT = 5;

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

  return (
    <section
      id="instagram"
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="instagram-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-16">
          <span className="section-badge-light mb-4">Instagram</span>
          <h2
            id="instagram-titulo"
            className="text-[40px] sm:text-[52px] font-black text-gray-900
                       leading-tight tracking-tight mt-4 mb-5"
          >
            Síguenos en{" "}
            <span className="text-naranja-500">Instagram</span>
          </h2>
          <p className="text-[18px] text-gray-600 max-w-xl mx-auto leading-relaxed">
            Mira nuestros últimos videos y mantente informado de todo lo que hacemos por las personas con discapacidad.
          </p>
          <p className="text-naranja-600 text-[15px] font-bold mt-2">@armandoruizdiputado</p>
        </FadeIn>

        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          role="list"
          aria-label="Publicaciones de Instagram de Armando Ruiz"
        >
          {/* Skeletons mientras carga */}
          {loading && Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[200px] sm:w-[240px]" aria-hidden="true">
              <div className="w-full aspect-[9/16] rounded-2xl bg-naranja-50 animate-pulse" />
            </div>
          ))}

          {/* Posts reales de Instagram */}
          {!loading && ready && posts.map((post, i) => {
            const isVideo = post.media_type === "VIDEO";
            const thumb   = isVideo ? post.thumbnail_url : post.media_url;
            return (
              <motion.div
                key={post.id}
                className="snap-start flex-shrink-0 w-[200px] sm:w-[240px]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                role="listitem"
              >
                <motion.a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full aspect-[9/16] rounded-2xl overflow-hidden
                             border-2 border-naranja-100 cursor-pointer group shadow-card"
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.a>
              </motion.div>
            );
          })}

          {/* Placeholders cuando no hay token aún */}
          {!loading && !ready && Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              className="snap-start flex-shrink-0 w-[200px] sm:w-[240px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              role="listitem"
            >
              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden
                             border-2 border-naranja-100 shadow-card">
                <div className="absolute inset-0 bg-gradient-to-br from-naranja-50 to-naranja-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Instagram className="w-10 h-10 text-naranja-300" aria-hidden="true" />
                </div>
                <div className="absolute top-3 right-3" aria-hidden="true">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
