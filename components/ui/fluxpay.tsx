"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

export type FluxPayStat = {
  value: string;
  label: string;
};

type FluxPayProps = {
  children: ReactNode;
  stats?: FluxPayStat[];
  className?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const RIPPLE_SPOTS = [
  [0.24, 0.74],
  [0.74, 0.44],
  [0.52, 0.9],
] as const;

/* A dark-theme take on the FluxPay pixel field: ember cells on near-black,
   a slow diagonal reveal, looping rings and a pointer bloom that swells cells. */
function PixelField({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastFrame = 0;
    let visible = true;
    let pointerX = -9999;
    let pointerY = -9999;
    let targetX = -9999;
    let targetY = -9999;
    const startedAt = performance.now();
    const ripples: { x: number; y: number; born: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      if (reduced) draw(performance.now());
    };

    const draw = (now: number) => {
      if (!width || !height) return;
      const t = (now - startedAt) / 1000;
      const time = Math.min(t, 4);
      const pitch = width < 640 ? 28 : 36;
      const cell = width < 640 ? 6 : 8;

      if (!reduced) {
        const slot = Math.max(0, Math.floor(time / 2.4));
        if (ripples.length === 0 || ripples[ripples.length - 1].born < now - 2350) {
          const spot = RIPPLE_SPOTS[slot % RIPPLE_SPOTS.length];
          ripples.push({ x: width * spot[0], y: height * spot[1], born: now });
          if (ripples.length > 4) ripples.shift();
        }
      }

      if (!reduced) {
        pointerX += (targetX - pointerX) * 0.22;
        pointerY += (targetY - pointerY) * 0.22;
      }

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / pitch);
      const rows = Math.ceil(height / pitch);
      const styles = [
        "rgba(120,53,15,0.55)",
        "rgba(194,65,12,0.66)",
        "rgba(249,115,22,0.80)",
        "rgba(253,186,116,0.95)",
      ];
      const buckets: number[][][] = styles.map(() => []);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = c * pitch;
          const y = r * pitch;
          const nx = x / width;
          const ny = y / height;

          const edge = Math.min(nx, 1 - nx, ny, 1 - ny);
          if (edge < 0.015) continue;
          const edgeFade = Math.min(1, edge / 0.16);

          const reveal = Math.max(0, Math.min(1, time * 1.05 - (nx * 0.42 + (1 - ny) * 0.3)));
          if (reveal <= 0) continue;

          let energy = 0;
          let grow = 1;
          if (!reduced) {
            for (const ripple of ripples) {
              const age = (now - ripple.born) / 1000;
              if (age > 3.4) continue;
              const distance = Math.hypot(x - ripple.x, y - ripple.y);
              const radius = age * Math.max(width, height) * 0.2;
              const gap = Math.abs(distance - radius);
              energy += Math.exp(-((gap / 26) ** 2)) * (1 - age / 3.4);
            }
            const pointerDistance = Math.hypot(x - pointerX, y - pointerY);
            if (pointerDistance < 240) {
              const lift = 1 - pointerDistance / 240;
              energy += lift * 0.42;
              grow += lift * 0.85;
            }
          }

          const hash = Math.sin(nx * 21.7 + ny * 13.1) * 0.5 + 0.5;
          const warmTop = Math.exp(
            -(((nx - 0.78) ** 2 + (ny - 0.16) ** 2) / 0.06),
          );
          const warmBase = Math.exp(
            -(((nx - 0.12) ** 2 + (ny - 0.86) ** 2) / 0.07),
          );
          const centre = Math.exp(
            -(((nx - 0.5) ** 2 + (ny - 0.62) ** 2) / 0.11),
          );
          const base = 0.13 + hash * 0.08;
          const value =
            (base +
              warmTop * 0.55 * (0.35 + hash * 0.65) +
              warmBase * 0.5 * (0.35 + hash * 0.65) +
              centre * 0.28 +
              energy) *
            reveal *
            edgeFade;

          if (value < 0.1) continue;

          let bucket = 0;
          if (value > 0.62) bucket = 3;
          else if (value > 0.4) bucket = 2;
          else if (value > 0.22) bucket = 1;
          buckets[bucket].push([x, y, cell * grow]);
        }
      }

      for (let b = 0; b < buckets.length; b += 1) {
        ctx.fillStyle = styles[b];
        for (const [x, y, size] of buckets[b]) {
          const offset = (size - cell) / 2;
          ctx.fillRect(x - offset, y - offset, size, size);
        }
      }
    };

    const frame = (now: number) => {
      raf = window.requestAnimationFrame(frame);
      if (!visible) return;
      if (now - lastFrame < 1000 / 24) return;
      lastFrame = now;
      draw(now);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      targetX = -9999;
      targetY = -9999;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    resize();

    if (reduced) {
      draw(performance.now());
    } else {
      raf = window.requestAnimationFrame(frame);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(120%_100%_at_50%_42%,black_38%,transparent_92%)]"
    />
  );
}

export function FluxPay({ children, stats, className }: FluxPayProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden rounded-[26px] border border-[#F6F5F0]/[0.10] bg-[#0B0B0C] text-[#F6F5F0] shadow-[0_50px_130px_-60px_rgba(0,0,0,0.9)] sm:rounded-[34px]",
        className,
      )}
    >
      <PixelField reduced={reduced} />

      {/* Warm pockets + a dark vignette so the field melts into the panel edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_44%_at_76%_14%,rgba(249,115,22,0.20),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(44%_40%_at_14%_84%,rgba(194,65,12,0.16),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_96%_at_50%_46%,transparent_46%,rgba(11,11,12,0.72)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/80 to-transparent"
      />

      <div className="relative z-10 flex flex-1 flex-col px-4 pt-28 pb-6 sm:px-8 sm:pt-32 sm:pb-8 lg:px-12">
        <div className="flex flex-1 items-center justify-center py-4 sm:py-6">
          {children}
        </div>

        {stats && stats.length > 0 && (
          <div className="mx-auto mt-4 w-full max-w-[760px] border-t border-[#F6F5F0]/[0.12]">
            <dl className="grid grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-4 text-center sm:py-5",
                    index !== 0 && "border-l border-[#F6F5F0]/[0.10]",
                  )}
                >
                  <dt className="order-2 text-[8px] font-medium uppercase tracking-[0.06em] text-[#A8A29E] sm:text-[10px] sm:tracking-[0.18em]">
                    {stat.label}
                  </dt>
                  <dd className="order-1 text-xl font-semibold tracking-[-0.03em] text-[#F6F5F0] tabular-nums sm:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export default FluxPay;
