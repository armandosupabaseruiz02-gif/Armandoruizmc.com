"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Instagram, Play } from "lucide-react";

const reels = [
  { id: "1", likes: "1.2K", comments: "48", color: "from-pink-400 to-orange-400" },
  { id: "2", likes: "980",  comments: "31", color: "from-purple-400 to-pink-400" },
  { id: "3", likes: "2.1K", comments: "72", color: "from-naranja-400 to-yellow-400" },
  { id: "4", likes: "756",  comments: "19", color: "from-red-400 to-pink-400" },
  { id: "5", likes: "1.5K", comments: "53", color: "from-blue-400 to-purple-400" },
];

export default function InstagramReels() {
  return (
    <section id="instagram" className="py-28 bg-white relative overflow-hidden" aria-labelledby="instagram-titulo">
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-16">
          <span className="section-badge-light mb-4">Instagram</span>
          <h2 id="instagram-titulo" className="text-[40px] sm:text-[52px] font-black text-gray-900 leading-tight tracking-tight mt-4 mb-5">
            Síguenos en <span className="bg-gradient-to-r from-naranja-600 via-naranja-500 to-naranja-400 bg-clip-text text-transparent">Instagram</span>
          </h2>
          <p className="text-[18px] text-gray-600 max-w-xl mx-auto leading-relaxed">
            Mira nuestros últimos videos y mantente informado de todo lo que hacemos por las personas con discapacidad.
          </p>
          <p className="text-naranja-600 text-[15px] font-bold mt-2">@armandoruizdiputado</p>
        </FadeIn>

        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          role="list"
          aria-label="Reels de Instagram"
        >
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              className="snap-start flex-shrink-0 w-[200px] sm:w-[240px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              role="listitem"
            >
              <motion.div
                className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border-2 border-naranja-100 cursor-pointer group shadow-card"
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                aria-label={`Reel con ${reel.likes} me gusta`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${reel.color} opacity-80`} />
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md
                                  group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-6 h-6 text-naranja-600 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                  <div className="flex items-center gap-3 text-white text-[13px] font-semibold">
                    <span>❤ {reel.likes}</span>
                    <span>💬 {reel.comments}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <FadeIn className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5
                       bg-gradient-to-r from-purple-500 via-pink-500 to-naranja-500
                       text-white font-bold text-[16px] rounded-full shadow-md
                       hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            aria-label="Ver perfil en Instagram (abre en nueva pestaña)"
          >
            <Instagram className="w-5 h-5" />
            Ver perfil en Instagram
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
