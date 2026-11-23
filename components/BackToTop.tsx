"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/**
 * Compact floating orange Back-to-Top button.
 * Uses passive scroll threshold + IntersectionObserver on the site footer
 * (zero forced synchronous layout reads on mobile scroll).
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let footerNear = false;
    let isShown = false;

    const sync = () => {
      const nextShown = pastHero && !footerNear;
      if (nextShown !== isShown) {
        isShown = nextShown;
        setVisible(nextShown);
      }
    };

    const onScroll = () => {
      pastHero = window.scrollY > 420;
      sync();
    };

    let footerObserver: IntersectionObserver | null = null;
    const siteFooter = document.getElementById("site-footer");
    if (siteFooter) {
      footerObserver = new IntersectionObserver(
        (entries) => {
          footerNear = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { rootMargin: "0px 0px -120px 0px" },
      );
      footerObserver.observe(siteFooter);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      footerObserver?.disconnect();
    };
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
        "group fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-3.5 z-50 flex size-8 items-center justify-center rounded-full border border-orange-200/55 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-mesh-orange transform-gpu transition-[opacity,transform,filter,box-shadow] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-mesh-orange-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-600 will-change-[transform,opacity,filter] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-6 sm:size-9",
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
          : "pointer-events-none translate-y-2.5 scale-90 opacity-0 blur-[6px]",
      )}
    >
      <ArrowUp
        aria-hidden="true"
        className="relative z-10 size-3.5 stroke-[2.4] transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-4"
      />
    </button>
  );
}
