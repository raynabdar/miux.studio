"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/**
 * Floating orange Back-to-Top button. Fades in/out with a progressive blur
 * (opacity + filter blur + slight rise) in both directions, and fades out
 * again when the footer "miux" wordmark approaches the viewport bottom.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let isShown = false;

    const nearFooterBrand = () => {
      const brand = document.getElementById("footer-brand");
      if (!brand) return false;
      // Hide once the wordmark's top edge is within ~140px of the viewport bottom
      return brand.getBoundingClientRect().top < window.innerHeight - 140;
    };

    const onScroll = () => {
      const nextShown = window.scrollY > 420 && !nearFooterBrand();
      if (nextShown !== isShown) {
        isShown = nextShown;
        setVisible(nextShown);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex size-11 items-center justify-center rounded-full border border-orange-200/50 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-mesh-orange transition-[opacity,transform,filter,box-shadow] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-mesh-orange-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-600 sm:bottom-[max(1.75rem,env(safe-area-inset-bottom))] sm:right-7 sm:size-12",
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
          : "pointer-events-none translate-y-3 scale-90 opacity-0 blur-md"
      )}
    >
      <ArrowUp
        aria-hidden="true"
        className="relative z-10 size-4.5 stroke-[2.3] transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-5"
      />
    </button>
  );
}
