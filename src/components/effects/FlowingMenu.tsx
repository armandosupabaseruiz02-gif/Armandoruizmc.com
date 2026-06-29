"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

export type FlowingMenuItem = {
  link: string;
  text: string;
  image: string;
  eyebrow?: string;
  description?: string;
  ariaLabel?: string;
  /** Explicación corta del área; muestra un botón "?" con globito. */
  info?: string;
};

type FlowingMenuProps = {
  items?: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onItemClick?: (item: FlowingMenuItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

type MenuItemProps = FlowingMenuItem & {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  onItemClick?: FlowingMenuProps["onItemClick"];
};

const animationDefaults = { duration: 0.55, ease: "expo.out" };

function distMetric(x: number, y: number, x2: number, y2: number) {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(mouseX: number, mouseY: number, width: number, height: number) {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function MenuItem({
  link,
  text,
  image,
  eyebrow,
  description,
  ariaLabel,
  speed,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  onItemClick,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>(
        ".flowing-marquee__part",
      );
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (!contentWidth) return;

      const needed = Math.ceil(window.innerWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>(
        ".flowing-marquee__part",
      );
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = window.setTimeout(setupMarquee, 50);

    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed, reducedMotion]);

  const showMarquee = useCallback(
    (clientX?: number, clientY?: number) => {
      if (reducedMotion || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
        return;
      }

      const rect = itemRef.current.getBoundingClientRect();
      const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
      const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap
        .timeline({ defaults: animationDefaults })
        .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
    },
    [reducedMotion],
  );

  const hideMarquee = useCallback(
    (clientX?: number, clientY?: number) => {
      if (reducedMotion || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
        return;
      }

      const rect = itemRef.current.getBoundingClientRect();
      const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
      const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap
        .timeline({ defaults: animationDefaults })
        .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
    },
    [reducedMotion],
  );

  return (
    <div className="flowing-menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="flowing-menu__item-link"
        href={link}
        aria-label={ariaLabel ?? `${text}${description ? `: ${description}` : ""}`}
        onClick={(event) => onItemClick?.({ link, text, image, eyebrow, description, ariaLabel }, event)}
        onFocus={() => showMarquee()}
        onBlur={() => hideMarquee()}
        onMouseEnter={(event) => showMarquee(event.clientX, event.clientY)}
        onMouseLeave={(event) => hideMarquee(event.clientX, event.clientY)}
      >
        <span className="flowing-menu__copy">
          {eyebrow ? <span className="flowing-menu__eyebrow">{eyebrow}</span> : null}
          <span className="flowing-menu__title">{text}</span>
          {description ? <span className="flowing-menu__description">{description}</span> : null}
        </span>
        <span className="flowing-menu__arrow" aria-hidden="true">
          {"->"}
        </span>
      </a>

      <div
        className="flowing-marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flowing-marquee__inner-wrap">
          <div className="flowing-marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {Array.from({ length: repetitions }).map((_, idx) => (
              <div
                className="flowing-marquee__part"
                key={idx}
                style={{ color: marqueeTextColor }}
              >
                <span>{text}</span>
                <div
                  className="flowing-marquee__img"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = "#7c2d12",
  bgColor = "#fff7ed",
  marqueeBgColor = "#f97316",
  marqueeTextColor = "#ffffff",
  borderColor = "#fed7aa",
  onItemClick,
}: FlowingMenuProps) {
  return (
    <div
      className="flowing-menu-wrap"
      style={
        {
          "--flowing-bg-color": bgColor,
          "--flowing-text-color": textColor,
          "--flowing-marquee-text-color": marqueeTextColor,
          "--flowing-border-color": borderColor,
        } as CSSProperties
      }
    >
      <nav className="flowing-menu" aria-label="Accesos directos">
        {items.map((item) => (
          <MenuItem
            key={`${item.link}-${item.text}`}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
}
