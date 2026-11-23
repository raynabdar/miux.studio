"use client";

import { useEffect, useState } from "react";
import { MeltingFooterText } from "@/components/ui/melting-footer-text";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The "miux" wordmark pinned to the viewport floor. It rises with the gradient
 * band during the last stretch of scroll, then rests exactly at the page end.
 */
export function FooterBrand({ text = "miux" }: { text?: string }) {
  const [reveal, setReveal] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(query.matches);
    syncMotion();
    query.addEventListener("change", syncMotion);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const band = document.querySelector<HTMLElement>("[data-ruixen-band]");
      const h = band?.offsetHeight || window.innerHeight * 0.44;
      const left =
        document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY;
      setReveal(clamp01((h - left) / h));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", syncMotion);
    };
  }, []);

  const eased = reveal * reveal * (3 - 2 * reveal);
  const offset = reduceMotion ? 0 : (1 - eased) * 26;
  const active = eased > 0.02;

  return (
    <div
      aria-hidden={!active}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[5]"
      style={{
        opacity: eased,
        transform: `translate3d(0, ${offset.toFixed(2)}%, 0)`,
        pointerEvents: active ? "auto" : "none",
        willChange: "opacity, transform",
      }}
    >
      <MeltingFooterText text={text} bare />
    </div>
  );
}
