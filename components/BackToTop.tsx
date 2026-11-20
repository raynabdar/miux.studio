"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/smooth-scroll";

/**
 * Floating shining-orange Back-to-Top button for mobile, tablet, and desktop.
 * Appears with a soft rise after scrolling past the hero and uses zero idle
 * animation frames (pure CSS keyframes + passive scroll threshold).
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let isShown = false;

    const onScroll = () => {
      const nextShown = window.scrollY > 420;
      if (nextShown !== isShown) {
        isShown = nextShown;
        setVisible(nextShown);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex size-11 items-center justify-center overflow-hidden rounded-full border border-orange-200/50 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-mesh-orange transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-mesh-orange-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-600 animate-btt-in sm:bottom-[max(1.75rem,env(safe-area-inset-bottom))] sm:right-7 sm:size-12"
    >
      {/* Top specular highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-0.5 h-px bg-gradient-to-r from-transparent via-white/85 to-transparent"
      />

      {/* Shining orange/white diagonal light sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-btt-shine"
      />

      {/* Primary crisp arrow */}
      <ArrowUp
        aria-hidden="true"
        className="relative z-10 size-4.5 stroke-[2.3] transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-5"
      />
    </button>
  );
}
