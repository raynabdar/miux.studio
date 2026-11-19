"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export function ClutchWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const w = window as unknown as { CLUTCHCO?: { init?: () => void } };
      if (w.CLUTCHCO && typeof w.CLUTCHCO.init === "function") {
        w.CLUTCHCO.init();
      }
    } catch {
      // Gracefully ignore if clutch is initializing
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-8 flex items-center justify-center min-h-[50px] w-full"
    >
      <Script
        src="https://widget.clutch.co/static/js/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            const w = window as unknown as { CLUTCHCO?: { init?: () => void } };
            if (w.CLUTCHCO && typeof w.CLUTCHCO.init === "function") {
              w.CLUTCHCO.init();
            }
          } catch {
            // Gracefully ignore
          }
        }}
      />
      <div
        className="clutch-widget"
        data-url="https://widget.clutch.co"
        data-widget-type="14"
        data-height="50"
        data-nofollow="false"
        data-expandifr="true"
        data-scale="100"
        data-clutchcompany-id="2772323"
      />
    </div>
  );
}
