"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import "./StaggeredMenu.css";

export type StaggeredMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type StaggeredMenuProps = {
  items: StaggeredMenuItem[];
  /** Contenido del pie del panel (p. ej. el botón "Mi cuenta"). */
  footer?: ReactNode;
  position?: "left" | "right";
  /** Capas de color que entran en cascada (paleta naranja de marca). */
  colors?: string[];
  accentColor?: string;
  displayItemNumbering?: boolean;
  className?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

function isExternalLink(href: string) {
  return /^(https?:|mailto:|tel:|\/\/)/.test(href);
}

function isRouterLink(href: string) {
  return Boolean(href) && !isExternalLink(href) && !href.startsWith("#");
}

// Detecta cliente vs. servidor sin setState en efecto (el overlay se porta a
// <body> y solo debe montarse en el cliente).
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function StaggeredMenu({
  items,
  footer,
  position = "right",
  colors = ["#fb923c", "#ea580c"],
  accentColor = "#ea580c",
  displayItemNumbering = true,
  className,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const openRef = useRef(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // El overlay vive en un portal a <body> para escapar del header
  // (que tiene transform y atraparía los position: fixed).

  // Estado inicial: panel y capas fuera de pantalla.
  useLayoutEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      const layers = preContainer
        ? (Array.from(preContainer.querySelectorAll(".sm-prelayer")) as HTMLElement[])
        : [];
      preLayerElsRef.current = layers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...layers], { xPercent: offscreen });
      gsap.set(panel, { opacity: 1 });
    });
    return () => ctx.revert();
  }, [position, mounted]);

  const resetItems = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const itemEls = Array.from(panel.querySelectorAll(".sm-itemLabel"));
    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 8 });
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-list[data-numbering] .sm-item"),
    );
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    const footerEl = panel.querySelector(".sm-footer");
    if (footerEl) gsap.set(footerEl, { opacity: 0, y: 20 });
  }, []);

  const playOpen = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-list[data-numbering] .sm-item"),
    );
    const footerEl = panel.querySelector(".sm-footer");

    if (prefersReducedMotion()) {
      gsap.set([...layers, panel], { xPercent: 0 });
      if (backdrop) gsap.set(backdrop, { opacity: 1 });
      if (itemEls.length) gsap.set(itemEls, { yPercent: 0, rotate: 0 });
      if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 1 });
      if (footerEl) gsap.set(footerEl, { opacity: 1, y: 0 });
      busyRef.current = false;
      return;
    }

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 8 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (footerEl) gsap.set(footerEl, { opacity: 0, y: 20 });

    const offscreen = position === "left" ? -100 : 100;
    const tl = gsap.timeline({ paused: true });

    if (backdrop) {
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
    }

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });

    const lastLayer = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsert = lastLayer + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsert,
    );

    if (itemEls.length) {
      const itemsStart = panelInsert + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (footerEl) {
      tl.to(
        footerEl,
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        panelInsert + panelDuration * 0.4,
      );
    }

    tl.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    openTlRef.current = tl;
    tl.play(0);
  }, [position]);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    openTlRef.current?.kill();
    openTlRef.current = null;
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;
    const all = [...layers, panel];

    if (prefersReducedMotion()) {
      gsap.set(all, { xPercent: offscreen });
      if (backdrop) gsap.set(backdrop, { opacity: 0 });
      resetItems();
      busyRef.current = false;
      return;
    }

    if (backdrop) {
      gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" });
    }
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        resetItems();
        busyRef.current = false;
      },
    });
  }, [position, resetItems]);

  const animateToggle = useCallback((opening: boolean) => {
    const [top, mid, bottom] = lineRefs.current;
    if (!top || !mid || !bottom) return;
    const dur = prefersReducedMotion() ? 0 : 0.3;
    gsap.to(top, { y: opening ? 7 : 0, rotate: opening ? 45 : 0, duration: dur, ease: "power3.out" });
    gsap.to(mid, { opacity: opening ? 0 : 1, duration: dur, ease: "power3.out" });
    gsap.to(bottom, { y: opening ? -7 : 0, rotate: opening ? -45 : 0, duration: dur, ease: "power3.out" });
  }, []);

  const setMenuState = useCallback(
    (next: boolean) => {
      if (busyRef.current && next) return;
      openRef.current = next;
      setOpen(next);
      busyRef.current = true;
      animateToggle(next);
      if (next) {
        onMenuOpen?.();
        playOpen();
      } else {
        onMenuClose?.();
        playClose();
      }
    },
    [animateToggle, onMenuOpen, onMenuClose, playOpen, playClose],
  );

  const toggleMenu = useCallback(() => setMenuState(!openRef.current), [setMenuState]);
  const closeMenu = useCallback(() => {
    if (openRef.current) setMenuState(false);
  }, [setMenuState]);

  // Cerrar con Escape + bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeMenu]);

  const handleItemClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: StaggeredMenuItem,
  ) => {
    item.onClick?.(event);
    closeMenu();
  };

  const renderItem = (item: StaggeredMenuItem, index: number) => {
    const content = <span className="sm-itemLabel">{item.label}</span>;
    const common = {
      className: "sm-item",
      "aria-label": item.ariaLabel || item.label,
      "data-index": index + 1,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => handleItemClick(e, item),
    };
    return isRouterLink(item.href) ? (
      <Link href={item.href} {...common}>
        {content}
      </Link>
    ) : (
      <a href={item.href} {...common}>
        {content}
      </a>
    );
  };

  const rootStyle = { "--sm-accent": accentColor } as CSSProperties;

  const overlay = (
    <div
      className="sm-overlay"
      data-position={position}
      data-open={open || undefined}
      style={rootStyle}
    >
      <div
        ref={backdropRef}
        className="sm-backdrop"
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 3).map((color, i) => (
          <div key={i} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="sm-panel"
        aria-hidden={!open}
        aria-label="Menú de navegación"
      >
        <div className="sm-panel-inner">
          <ul className="sm-list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => (
              <li className="sm-itemWrap" key={item.href || `sm-${index}`}>
                {renderItem(item, index)}
              </li>
            ))}
          </ul>
          {footer ? <div className="sm-footer">{footer}</div> : null}
        </div>
      </aside>
    </div>
  );

  return (
    <div ref={rootRef} className={cn("sm-root", className)}>
      <button
        ref={toggleRef}
        type="button"
        className="sm-toggle"
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={toggleMenu}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="sm-toggle-line"
            aria-hidden="true"
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          />
        ))}
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
