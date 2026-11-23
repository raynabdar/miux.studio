"use client";

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";

interface BlurRevealTitleProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: HeadingTag;
  delay?: number;
  duration?: number;
}

/**
 * Hardware-composited progressive blur reveal that runs identically and smoothly
 * on mobile, tablet, and desktop via native CSS transitions (no per-frame JS filter writes).
 */
export function BlurRevealTitle({
  children,
  className,
  as = "h2",
  delay = 0,
  duration = 0.72,
  style,
  ...props
}: BlurRevealTitleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.requestAnimationFrame(() => setRevealed(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transform-gpu will-change-[transform,opacity,filter]",
        className,
      )}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, 16px, 0)",
        filter: revealed ? "blur(0px)" : "blur(10px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
