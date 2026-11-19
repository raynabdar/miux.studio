"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassIconReveal } from "@/components/GlassIconReveal";

const MIUX_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="currentColor"><path d="M121 264h57v57h-57z"/><path d="M236 148h57l114 114v59h-57l-57-57v57h-57l-57-57v-58h57z"/></svg>`;

const MIN_VISIBLE_MS = 1700;
const MAX_VISIBLE_MS = 3000;

export function SitePreloader() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setShowPreloader(false);
    try {
      sessionStorage.setItem("miux_preloaded", "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
      ).connection;
      if (connection?.saveData || connection?.effectiveType === "slow-2g") return;
      if (sessionStorage.getItem("miux_preloaded") === "true") return;

      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads sessionStorage and document readiness, unavailable during SSR
      setShowPreloader(true);

      const startedAt = performance.now();
      let hideTimer: ReturnType<typeof setTimeout> | undefined;

      const scheduleHide = () => {
        const elapsed = performance.now() - startedAt;
        hideTimer = setTimeout(dismiss, Math.max(0, MIN_VISIBLE_MS - elapsed));
      };

      if (document.readyState === "complete") {
        scheduleHide();
      } else {
        window.addEventListener("load", scheduleHide, { once: true });
      }

      const maxTimer = setTimeout(dismiss, MAX_VISIBLE_MS);

      return () => {
        window.removeEventListener("load", scheduleHide);
        if (hideTimer) clearTimeout(hideTimer);
        clearTimeout(maxTimer);
      };
    } catch {
      setShowPreloader(false);
    }
  }, [dismiss]);

  return (
    <AnimatePresence mode="wait">
      {showPreloader && (
        <motion.div
          key="site-preloader"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#F6F5F0]"
        >
          <span className="sr-only">Loading Miux Studio</span>
          <div aria-hidden="true" className="relative flex aspect-square w-full max-w-[300px] items-center justify-center">
            <GlassIconReveal
              logo={MIUX_LOGO_SVG}
              label="Miux Studio"
              look="light"
              background="#F6F5F0"
              plateColor="#FFFFFF"
              logoColor="#141414"
              tileSize={280}
              logoScale={0.65}
              finalScale={0.85}
              loop={false}
              tuning={{
                present: 1.8,
                glide: 1.8,
                response: 0.38,
                startZoom: 2.0,
              }}
              className="h-full w-full"
            />
          </div>
          {!dismissed && (
            <button
              type="button"
              onClick={dismiss}
              className="absolute bottom-8 rounded-full border border-[#141414]/[0.16] px-5 py-2 text-xs font-medium text-[#5C5A55] transition-colors hover:border-[#141414]/35 hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              Skip intro
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SitePreloader;
