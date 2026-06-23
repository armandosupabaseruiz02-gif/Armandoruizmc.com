"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowLeft, ArrowRight, ExternalLink, Instagram, Play } from "lucide-react";
import type { InstagramPost } from "@/app/api/instagram/route";

const FALLBACK_POSTS: InstagramPost[] = Array.from({ length: 6 }, (_, index) => ({
  id: `fallback-${index}`,
  media_type: "IMAGE",
  media_url: "/images/armando-ruiz-movimiento-naranja.jpg",
  permalink: "https://www.instagram.com/armandoruizmc",
  caption: "Armando Ruiz en Movimiento Ciudadano",
  timestamp: new Date().toISOString(),
}));

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const half = total / 2;

  if (offset > half) offset -= total;
  if (offset < -half) offset += total;

  return offset;
}

function useWideCarousel() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isWide;
}

function ReelCard({
  index,
  isFallback,
  offset,
  post,
  spread,
  total,
}: {
  index: number;
  isFallback: boolean;
  offset: number;
  post: InstagramPost;
  spread: number;
  total: number;
}) {
  const distance = Math.abs(offset);
  const isVideo = post.media_type === "VIDEO";
  const thumb = isVideo ? post.thumbnail_url : post.media_url;
  const isActive = offset === 0;

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute left-1/2 top-1/2 block w-[min(72vw,260px)] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(124,45,18,0.18)] outline-none sm:w-[290px] lg:w-[320px]"
      aria-label={post.caption ? `Ver publicación: ${post.caption.slice(0, 80)}` : "Ver publicación en Instagram"}
      tabIndex={isActive ? undefined : -1}
      animate={{
        x: `calc(-50% + ${offset * spread}px)`,
        y: "-50%",
        rotate: offset * -5,
        scale: isActive ? 1 : 0.82 - Math.min(distance, 2) * 0.08,
        opacity: distance > 2 ? 0 : isActive ? 1 : 0.58,
        zIndex: total - distance,
      }}
      transition={{ type: "spring", stiffness: 210, damping: 26 }}
      whileHover={isActive ? { y: "-53%", scale: 1.03 } : undefined}
      whileFocus={isActive ? { y: "-53%", scale: 1.03 } : undefined}
    >
      <div className="relative aspect-[4/5]">
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={post.caption?.slice(0, 90) ?? "Publicación de Instagram de Armando Ruiz"}
            className="h-full w-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/8 to-transparent" />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-naranja-600 shadow-xl">
              <Play className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true" />
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-[12px] font-black uppercase tracking-[0.14em] text-naranja-600 shadow-sm backdrop-blur">
          <Instagram className="h-4 w-4" aria-hidden="true" />
          Instagram
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="line-clamp-2 text-[15px] font-bold leading-5 text-white drop-shadow-md">
            {isFallback
              ? "Conecta Instagram para mostrar las publicaciones recientes del diputado."
              : post.caption || "Trabajo ciudadano de Armando Ruiz"}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-black text-white">
            Ver publicación
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function InstagramCoverflow({ isFallback, posts }: { isFallback: boolean; posts: InstagramPost[] }) {
  const shouldReduceMotion = useReducedMotion();
  const isWide = useWideCarousel();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const spread = isWide ? 235 : 135;

  const visiblePosts = useMemo(() => {
    return posts.map((post, index) => ({
      index,
      offset: getWrappedOffset(index, activeIndex, posts.length),
      post,
    }));
  }, [activeIndex, posts]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || posts.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isPaused, posts.length, shouldReduceMotion]);

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + posts.length) % posts.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % posts.length);
  }

  return (
    <div
      className="relative mx-auto mt-12 max-w-7xl px-5 sm:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-52 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_66%)]"
        aria-hidden="true"
      />

      <div
        className="relative h-[460px] overflow-hidden rounded-[32px] border border-naranja-100 bg-gradient-to-br from-white via-naranja-50/80 to-white shadow-[0_30px_100px_rgba(124,45,18,0.10)] sm:h-[520px]"
        role="region"
        aria-label="Carrusel animado de publicaciones de Instagram de Armando Ruiz"
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

        <AnimatePresence initial={false}>
          {visiblePosts.map(({ index, offset, post }) => {
            if (Math.abs(offset) > 3) return null;

            return (
              <ReelCard
                key={post.id}
                index={index}
                isFallback={isFallback}
                offset={offset}
                post={post}
                spread={spread}
                total={posts.length}
              />
            );
          })}
        </AnimatePresence>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/80 bg-white/88 px-3 py-2 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={goToPrevious}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-naranja-50 text-naranja-700 transition-colors hover:bg-naranja-500 hover:text-white"
            aria-label="Ver publicación anterior"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1.5">
            {posts.slice(0, 8).map((post, index) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-7 bg-naranja-500" : "w-2 bg-naranja-200 hover:bg-naranja-300"
                }`}
                aria-label={`Ir a publicación ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-naranja-500 text-white transition-colors hover:bg-naranja-600"
            aria-label="Ver publicación siguiente"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstagramReels() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.length) {
          setPosts(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasInstagramPosts = posts.length > 0;
  const carouselPosts = hasInstagramPosts ? posts : FALLBACK_POSTS;

  return (
    <section
      id="instagram"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="instagram-titulo"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn className="text-center">
          <span className="section-badge-light">Instagram</span>
          <h2
            id="instagram-titulo"
            className="mt-5 text-[40px] font-black leading-tight tracking-tight text-gray-950 sm:text-[52px]"
          >
            El trabajo también se ve en{" "}
            <span className="text-highlight">Instagram</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-gray-700">
            Un carrete con fotos y videos recientes del diputado Armando Ruiz.
          </p>
          <p className="mt-3 text-[15px] font-black text-naranja-600">@armandoruizmc</p>
        </FadeIn>
      </div>

      <FadeIn>
        {loading ? (
          <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8" aria-hidden="true">
            <div className="h-[460px] animate-pulse rounded-[32px] bg-naranja-50 sm:h-[520px]" />
          </div>
        ) : (
          <InstagramCoverflow isFallback={!hasInstagramPosts} posts={carouselPosts} />
        )}
      </FadeIn>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn className="mt-8 text-center">
          <a
            href="https://www.instagram.com/armandoruizmc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
            aria-label="Ver perfil completo en Instagram (abre en nueva pestaña)"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
            Ver perfil en Instagram
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
