"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassIconReveal } from "@/components/GlassIconReveal";

const MIUX_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="currentColor"><path d="M121 264h57v57h-57z"/><path d="M236 148h57l114 114v59h-57l-57-57v57h-57l-57-57v-58h57z"/></svg>`;

export function SitePreloader() {
  const [showPreloader, setShowPreloader] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    try {
      const alreadyPreloaded =
        sessionStorage.getItem("miux_preloaded") === "true";

      const areAssetsReady = () => {
        if (typeof window === "undefined") return true;
        if (document.readyState !== "complete") return false;
        const images = Array.from(document.images);
        const critical = images.filter(
          (img) => !img.loading || img.loading === "eager",
        );
        return critical.every((img) => img.complete && img.naturalWidth > 0);
      };

      if (alreadyPreloaded || areAssetsReady()) {
        setShowPreloader(false);
        return;
      }

      setShowPreloader(true);

      const dismiss = () => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        try {
          sessionStorage.setItem("miux_preloaded", "true");
        } catch {}
        setShowPreloader(false);
      };

      // 4-second safety timeout: guarantees preloader hides and never loops indefinitely
      const safetyTimeout = setTimeout(dismiss, 4000);

      // Once resources are loaded, dismiss smoothly after short logo reveal
      const handleLoad = () => {
        setTimeout(dismiss, 1600);
      };

      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad, { once: true });
      }

      return () => {
        clearTimeout(safetyTimeout);
        window.removeEventListener("load", handleLoad);
      };
    } catch {
      setShowPreloader(false);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showPreloader && (
        <motion.div
          key="site-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#141414]"
        >
          <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
            <GlassIconReveal
              logo={MIUX_LOGO_SVG}
              label="Miux Studio"
              look="dark"
              background="#141414"
              plateColor="#1c1c1c"
              logoColor="#ffffff"
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
              className="w-full h-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SitePreloader;
