"use client";

import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

type CardChildProps = HTMLAttributes<HTMLDivElement> & {
  style?: CSSProperties;
};

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

type CardSwapProps = {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  children: ReactNode;
};

const animationConfig = {
  elastic: {
    ease: "elastic.out(0.6,0.9)",
    durDrop: 2,
    durMove: 2,
    durReturn: 2,
    promoteOverlap: 0.9,
    returnDelay: 0.05,
  },
  smooth: {
    ease: "power1.inOut",
    durDrop: 0.8,
    durMove: 0.8,
    durReturn: 0.8,
    promoteOverlap: 0.45,
    returnDelay: 0.2,
  },
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { customClass, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        "absolute left-1/2 top-1/2 overflow-hidden rounded-[28px] border border-white/20 bg-gray-950 shadow-2xl shadow-black/30 [backface-visibility:hidden] [transform-style:preserve-3d] [-webkit-backface-visibility:hidden] will-change-transform",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_42%)]",
        customClass,
        className,
      )}
    />
  );
});

function makeSlot(i: number, distX: number, distY: number, total: number): Slot {
  return {
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
  };
}

function placeNow(el: HTMLDivElement | null, slot: Slot, skew: number) {
  if (!el) return;

  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
}

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config = animationConfig[easing];
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const childCount = childArr.length;
  const refs = useMemo(
    () => Array.from({ length: childCount }, () => createRef<HTMLDivElement>()),
    [childCount],
  );
  const order = useRef<number[]>(Array.from({ length: childCount }, (_, i) => i));
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    order.current = Array.from({ length: total }, (_, i) => i);

    refs.forEach((ref, i) => {
      placeNow(ref.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const clearSwapInterval = () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      timelineRef.current?.kill();
      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        if (!el) return;

        timeline.set(el, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      timeline.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      timeline.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      timeline.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      timeline.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (!pauseOnHover) {
      return () => {
        clearSwapInterval();
        timelineRef.current?.kill();
      };
    }

    const node = container.current;
    if (!node) {
      return () => {
        clearSwapInterval();
        timelineRef.current?.kill();
      };
    }

    const pause = () => {
      timelineRef.current?.pause();
      clearSwapInterval();
    };

    const resume = () => {
      timelineRef.current?.play();
      clearSwapInterval();
      intervalRef.current = window.setInterval(swap, delay);
    };

    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);

    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      clearSwapInterval();
      timelineRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs, config]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement<CardChildProps>(child)) return child;

    const element = child as ReactElement<CardChildProps>;
    return cloneElement(element, {
      key: element.key ?? i,
      ref: refs[i] as Ref<HTMLDivElement>,
      style: { width, height, ...(element.props.style ?? {}) },
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        element.props.onClick?.(event);
        onCardClick?.(i);
      },
    } as Partial<CardChildProps> & { ref: Ref<HTMLDivElement> });
  });

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 origin-bottom-right overflow-visible [perspective:900px] [transform:translate(5%,20%)] motion-reduce:!transform-none max-lg:[transform:scale(0.78)_translate(22%,24%)] max-md:[transform:scale(0.72)_translate(25%,25%)] max-[480px]:[transform:scale(0.55)_translate(25%,25%)]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
}
