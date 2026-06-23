"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import "./PillNav.css";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  scrollHref?: string;
};

type PillNavProps = {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, item: PillNavItem) => void;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
};

type CssVars = CSSProperties & {
  "--base": string;
  "--pill-bg": string;
  "--hover-text": string;
  "--pill-text": string;
};

function isExternalLink(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function isRouterLink(href: string) {
  return href && !isExternalLink(href) && !href.startsWith("#");
}

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  pillColor = "#120F17",
  hoveredPillTextColor = "#120F17",
  pillTextColor,
  onItemClick,
  onMobileMenuClick,
  initialLoadAnimation = true,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const radius = ((w * w) / 4 + h * h) / (2 * h);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (w * w) / 4))) + 1;
        const originY = diameter - delta;

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    document.fonts?.ready.then(layout).catch(() => {});

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation && !prefersReducedMotion) {
      const logoNode = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoNode) {
        gsap.set(logoNode, { scale: 0 });
        gsap.to(logoNode, { scale: 1, duration: 0.6, ease });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, { width: "auto", duration: 0.6, ease });
      }
    }

    const timelines = [...tlRefs.current];
    const activeTweens = [...activeTweenRefs.current];

    return () => {
      window.removeEventListener("resize", onResize);
      timelines.forEach((tl) => tl?.kill());
      activeTweens.forEach((tween) => tween?.kill());
      logoTweenRef.current?.kill();
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (index: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (index: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = logoImgRef.current;
    if (!img) return;

    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      gsap.to(lines[0], { rotation: newState ? 45 : 0, y: newState ? 3 : 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: newState ? -45 : 0, y: newState ? -3 : 0, duration: 0.3, ease });
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: "top center" },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => gsap.set(menu, { visibility: "hidden" }),
        });
      }
    }

    onMobileMenuClick?.();
  };

  const cssVars: CssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
  };

  const renderLink = (item: PillNavItem, index: number, mobile = false) => {
    const className = mobile
      ? cn("mobile-menu-link", activeHref === item.href && "is-active")
      : cn("pill", activeHref === item.href && "is-active");
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onItemClick?.(event, item);
      if (mobile) setIsMobileMenuOpen(false);
    };

    const content = mobile ? (
      item.label
    ) : (
      <>
        <span
          className="hover-circle"
          aria-hidden="true"
          ref={(el) => {
            circleRefs.current[index] = el;
          }}
        />
        <span className="label-stack">
          <span className="pill-label">{item.label}</span>
          <span className="pill-label-hover" aria-hidden="true">
            {item.label}
          </span>
        </span>
      </>
    );

    if (isRouterLink(item.href)) {
      return (
        <Link
          href={item.href}
          className={className}
          aria-label={item.ariaLabel || item.label}
          onClick={handleClick}
          onMouseEnter={mobile ? undefined : () => handleEnter(index)}
          onMouseLeave={mobile ? undefined : () => handleLeave(index)}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={item.href}
        className={className}
        aria-label={item.ariaLabel || item.label}
        onClick={handleClick}
        onMouseEnter={mobile ? undefined : () => handleEnter(index)}
        onMouseLeave={mobile ? undefined : () => handleLeave(index)}
      >
        {content}
      </a>
    );
  };

  return (
    <div className="pill-nav-container">
      <nav className={cn("pill-nav", className)} aria-label="Navegación principal" style={cssVars}>
        <Link
          className="pill-logo"
          href="/"
          aria-label="Ir al inicio"
          onMouseEnter={handleLogoEnter}
          ref={(el) => {
            logoRef.current = el;
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </Link>

        <div className="pill-nav-items pill-desktop-only" ref={navItemsRef}>
          <ul className="pill-list">
            {items.map((item, index) => (
              <li key={item.href || `item-${index}`}>{renderLink(item, index)}</li>
            ))}
          </ul>
        </div>

        <button
          className="pill-mobile-menu-button pill-mobile-only"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          ref={hamburgerRef}
          type="button"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="pill-mobile-menu-popover pill-mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, index) => (
            <li key={item.href || `mobile-item-${index}`}>{renderLink(item, index, true)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
