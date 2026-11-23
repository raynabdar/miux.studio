"use client";

import * as React from "react";
import Image from "next/image";
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
  const [hovered, setHovered] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const firstSetRef = React.useRef<HTMLDivElement | null>(null);
  const targetPausedRef = React.useRef(false);
  const reducedMotionRef = React.useRef(false);
  const wakeRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const isPaused = hovered || reducedMotion;

  React.useEffect(() => {
    targetPausedRef.current = isPaused;
    reducedMotionRef.current = reducedMotion;
    wakeRef.current?.();
  }, [isPaused, reducedMotion]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!section || !track || !firstSet) return;

    let setWidth = firstSet.offsetWidth;
    let offset = setWidth > 0 ? -setWidth : 0;
    let currentVelocity = 0;
    let lastTime = performance.now();
    let rafId = 0;
    let inView = true;
    let pageVisible = document.visibilityState !== "hidden";

    const stop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const updateWidth = () => {
      const nextWidth = firstSet.offsetWidth;
      if (nextWidth > 0) {
        setWidth = nextWidth;
        if (offset < -setWidth || offset > 0) {
          offset = -setWidth;
        }
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (!inView || !pageVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (reducedMotionRef.current || setWidth <= 0) {
        currentVelocity = 0;
        track.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }

      const cruiseVelocity = setWidth / Math.max(speed, 1);
      const targetVelocity = targetPausedRef.current ? 0 : cruiseVelocity;
      // Quick, smooth halt on pause/hover (no long crawl), gentle ramp-up on resume
      const damping = targetVelocity === 0 ? 10 : 3.2;
      currentVelocity +=
        (targetVelocity - currentVelocity) * (1 - Math.exp(-dt * damping));

      if (targetVelocity === 0 && Math.abs(currentVelocity) < 0.5) {
        currentVelocity = 0;
        // Snap to a whole pixel when at rest so logos stay crisp (no shimmer)
        offset = Math.round(offset);
      }

      if (currentVelocity > 0) {
        offset += currentVelocity * dt;
        if (offset >= 0) {
          offset -= setWidth;
        }
      }

      track.style.transform = `translate3d(${offset}px, 0px, 0px)`;

      // Stop scheduling frames once completely settled at rest
      if (targetVelocity > 0 || currentVelocity > 0) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (rafId || !inView || !pageVisible) return;
      if (reducedMotionRef.current) {
        track.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(tick);
    };

    wakeRef.current = wake;

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
      wake();
    });
    resizeObserver.observe(firstSet);

    const intersectionObserver = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (inView) {
        wake();
      } else {
        stop();
      }
    });
    intersectionObserver.observe(section);

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) {
        wake();
      } else {
        stop();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    wake();

    return () => {
      stop();
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [speed, logos]);

  return (
    <section
      ref={sectionRef}
      aria-label="Brands our team has worked with"
      className={cn(
        "relative w-full overflow-hidden bg-[#F6F5F0] py-8 sm:py-12 select-none",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-center">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-[#5C5A55]">
          Brands our team has worked with
        </p>
      </div>
      <div className="relative mx-auto max-w-[1280px] overflow-hidden">
        {/* Left endpoint progressive blur + off-white fade */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#F6F5F0] via-[#F6F5F0]/85 to-transparent" />
        </div>

        {/* Right endpoint progressive blur + off-white fade */}
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
          <div className="absolute inset-0 bg-gradient-to-l from-[#F6F5F0] via-[#F6F5F0]/85 to-transparent" />
        </div>

        {/* Continuous Left-to-Right Loop Track with smooth slow pause */}
        <div
          className="relative flex overflow-hidden py-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            ref={trackRef}
            className="flex w-max items-center will-change-transform"
          >
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                ref={setIndex === 0 ? firstSetRef : undefined}
                aria-hidden={setIndex === 1 ? "true" : undefined}
                className="flex items-center gap-12 sm:gap-16 md:gap-20 pr-12 sm:pr-16 md:pr-20 shrink-0"
              >
                {logos.map((logo, idx) => (
                  <div
                    key={`${logo.name}-${setIndex}-${idx}`}
                    className="flex items-center justify-center shrink-0 opacity-70 transition-opacity duration-300 hover:opacity-100"
                  >
                    <Image
                      src={logo.src}
                      alt={setIndex === 0 ? logo.name : ""}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                      className={cn(
                        "w-auto object-contain select-none brightness-0",
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
