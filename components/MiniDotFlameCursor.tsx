"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, SEO-friendly desktop-only glowing orange dot cursor.
 * - Renders nothing during SSR or on touch/reduced-motion devices (zero DOM/LCP/CLS overhead for crawlers and mobile).
 * - Single glow dot only (no trailing/following elements) with zero idle animation loop.
 */
export default function MiniDotFlameCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reducedMotion) return;

    // Defer enabling until after initial paint so LCP/hydration stays completely untouched
    const enableId = window.requestAnimationFrame(() => setEnabled(true));
    return () => window.cancelAnimationFrame(enableId);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const style = document.createElement("style");
    style.setAttribute("data-cursor", "glow-dot");
    style.textContent = `html, html * { cursor: none !important; }`;
    document.head.appendChild(style);

    let rafId = 0;
    let x = -100;
    let y = -100;
    let hovering = false;
    let visible = false;

    const flush = () => {
      rafId = 0;
      dot.style.opacity = visible ? "1" : "0";
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.45 : 1})`;
    };

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(flush);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      visible = true;
      const target = e.target as HTMLElement | null;
      hovering = !!target?.closest(
        "a, button, [role='button'], input, textarea, select",
      );
      schedule();
    };

    const onLeave = () => {
      visible = false;
      schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave, {
      passive: true,
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      style.remove();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 9,
        height: 9,
        borderRadius: "50%",
        opacity: 0,
        background:
          "radial-gradient(circle, #ffffff 0%, #ffd29a 35%, #ff7a1a 72%, #ff3d00 100%)",
        boxShadow:
          "0 0 10px 2px rgba(255, 140, 40, 0.88), 0 0 22px 6px rgba(255, 72, 10, 0.42)",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform, opacity",
        contain: "layout style",
        transition: "opacity 0.18s ease",
      }}
    />
  );
}
