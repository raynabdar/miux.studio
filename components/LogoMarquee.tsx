"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";

export interface CompanyLogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
  className?: string;
}

export const COMPANY_LOGOS: CompanyLogoItem[] = [
  {
    name: "Stack Overflow",
    src: "/logos/stackoverflow.png",
    width: 300,
    height: 59,
    className: "h-6 sm:h-7",
  },
  {
    name: "Vercel",
    src: "/logos/vercel.png",
    width: 300,
    height: 60,
    className: "h-5 sm:h-6",
  },
  {
    name: "Zoom",
    src: "/logos/zoom.png",
    width: 300,
    height: 68,
    className: "h-5 sm:h-6",
  },
  {
    name: "Twilio",
    src: "/logos/twilio.png",
    width: 300,
    height: 108,
    className: "h-7 sm:h-8",
  },
  {
    name: "Replit",
    src: "/logos/replit.png",
    width: 300,
    height: 86,
    className: "h-6 sm:h-7",
  },
  {
    name: "LaunchDarkly",
    src: "/logos/launchdarkly.png",
    width: 300,
    height: 46,
    className: "h-5 sm:h-6",
  },
  {
    name: "HubSpot",
    src: "/logos/hubspot.png",
    width: 300,
    height: 85,
    className: "h-6 sm:h-7",
  },
  {
    name: "Cloudflare",
    src: "/logos/cloudflare.png",
    width: 300,
    height: 25,
    className: "h-3.5 sm:h-4",
  },
];

export function CompanyCardMarquee({
  logos = COMPANY_LOGOS,
  className,
  speed = 32,
}: {
  logos?: CompanyLogoItem[];
  className?: string;
  speed?: number;
}) {
  return (
    <section
      aria-label="Trusted partner companies"
      className={cn(
        "relative w-full overflow-hidden bg-[#141414] py-8 sm:py-12 select-none",
        className
      )}
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden">
        {/* Left endpoint progressive blur + dark fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 md:w-40"
        >
          <ProgressiveBlur
            direction="left"
            blurLayers={7}
            blurIntensity={0.75}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/85 to-transparent" />
        </div>

        {/* Right endpoint progressive blur + dark fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 md:w-40"
        >
          <ProgressiveBlur
            direction="right"
            blurLayers={7}
            blurIntensity={0.75}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#141414] via-[#141414]/85 to-transparent" />
        </div>

        {/* Continuous Left-to-Right Loop Track — pauses when hovered */}
        <div className="relative flex overflow-hidden py-3">
          <div
            className="flex w-max items-center animate-marquee-reverse hover:[animation-play-state:paused]"
            style={{ "--duration": `${speed}s` } as React.CSSProperties}
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                className="flex items-center gap-12 sm:gap-16 md:gap-20 pr-12 sm:pr-16 md:pr-20 shrink-0"
              >
                {logos.map((logo, idx) => (
                  <div
                    key={`${logo.name}-${setIndex}-${idx}`}
                    className="flex items-center justify-center shrink-0 opacity-75 transition-opacity duration-300 hover:opacity-100"
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                      className={cn(
                        "w-auto object-contain select-none brightness-0 invert",
                        logo.className || "h-6 sm:h-7"
                      )}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyCardMarquee;
