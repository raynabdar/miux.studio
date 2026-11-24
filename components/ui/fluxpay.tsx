"use client";

import Grainient from "@/components/Grainient";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export type FluxPayStat = {
  value: string;
  label: string;
};

type FluxPayProps = {
  children: ReactNode;
  stats?: FluxPayStat[];
  className?: string;
};

const HERO_PALETTE = ['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa'];

export function FluxPay({ children, stats, className }: FluxPayProps) {
  return (
    <div
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden rounded-[26px] border border-[#F6F5F0]/[0.10] bg-[#0B0B0C] text-[#F6F5F0] shadow-[0_50px_130px_-60px_rgba(0,0,0,0.9)] sm:rounded-[34px]",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Grainient
          colors={HERO_PALETTE}
          angle={55}
          flow={0.8}
          silk={0.35}
          grainAmount={0.08}
          lightMode
        />
      </div>

      {/* Single dark wash: the light-mode grainient turns the panel into a warm
          cream-to-ember field, and the wash deepens it into a smoky ember so the
          hero copy keeps its contrast. A second vignette would muddle the hue. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B0B0C]/80"
      />

      {/* Dark scrim under the stats row so the numbers stay legible. */}
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
