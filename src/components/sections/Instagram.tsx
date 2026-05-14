"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Instagram, Play } from "lucide-react";

const reels = [
  { id: "1", likes: "1.2K", comments: "48",  shade: "from-naranja-700  to-naranja-500"  },
  { id: "2", likes: "980",  comments: "31",  shade: "from-naranja-800  to-naranja-600"  },
  { id: "3", likes: "2.1K", comments: "72",  shade: "from-naranja-600  to-orange-400"   },
  { id: "4", likes: "756",  comments: "19",  shade: "from-naranja-900  to-naranja-700"  },
  { id: "5", likes: "1.5K", comments: "53",  shade: "from-orange-400   to-naranja-500"  },
];

export default function InstagramReels() {
  return (
    <section
      id="instagram"
      className="py-28 bg-ink-950 relative overflow-hidden"
      aria-labelledby="instagram-titulo"
    >
      {/* Fondo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-16">
          <span className="section-badge-dark mb-4">Instagram</span>
          <h2
            id="instagram-titulo"
            className="text-[40px] sm:text-[52px] font-black text-white
                       leading-tight tracking-tight mt-4 mb-5"
          >
            Síguenos en{" "}
            <span className="text-naranja-400">Instagram</span>
          </h2>
          <p className="text-[17px] text-white/50 max-w-xl mx-auto leading-relaxed">
            Mira nuestros últimos videos y mantente informado de todo lo que hacemos por la inclusión en el Estado de México.
          </p>
          <p className="text-naranja-400 text-[15px] font-semibold mt-2">
            @armandoruizdiputado
          </p>
        </FadeIn>

        {/* Carrusel */}
        <div
          className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory
                     scrollbar-thin scrollbar-thumb-naranja-500/40 scrollbar-track-transparent"
          role="list"
          aria-label="Reels de Instagram"
        >
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              className="snap-start flex-shrink-0 w-[200px] sm:w-[240px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              role="listitem"
            >
              <motion.div
                className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden
                           border border-white/10 cursor-pointer group"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                aria-label={`Reel con ${reel.likes} me gusta`}
              >
                {/* Placeholder naranja */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reel.shade} opacity-70`} />
                <div className="absolute inset-0 bg-ink-950/50" />

                {/* Play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full bg-white/15
                                flex items-center justify-center border border-white/20
                                group-hover:bg-white/25 transition-colors"
                  >
                    <Play className="w-6 h-6 text-white ml-1" fill="white" aria-hidden="true" />
                  </div>
                </div>

                {/* Overlay con stats */}
                <div className="absolute bottom-0 left-0 right-0 p-3
                                bg-gradient-to-t from-ink-950/80 to-transparent">
                  <div className="flex items-center gap-3 text-white text-[12px] font-medium">
                    <span>❤ {reel.likes}</span>
                    <span>💬 {reel.comments}</span>
                  </div>
                </div>

                {/* Badge IG — usa colores de marca de Instagram intencionalmente */}
                <div className="absolute top-3 right-3" aria-hidden="true">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400
                                  flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
            aria-label="Ver perfil de Instagram (abre en nueva pestaña)"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
            Ver perfil en Instagram
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
