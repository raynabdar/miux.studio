"use client";

import WavesBackground from "@/components/ui/waves-background";
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

export function FluxPay({ children, stats, className }: FluxPayProps) {
  return (
    <div
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden rounded-[26px] border border-[#F6F5F0]/[0.10] bg-[#0B0B0C] text-[#F6F5F0] shadow-[0_50px_130px_-60px_rgba(0,0,0,0.9)] sm:rounded-[34px]",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <WavesBackground className="absolute inset-0" />
      </div>

      {/* Flat wash keeps the ember waves smoky; the centre-weighted radial
          deepens the field behind the headline so cream copy keeps contrast
          while the moving colour stays readable towards the panel edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B0B0C]/52"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(11,11,12,0.66)_0%,rgba(11,11,12,0.42)_48%,rgba(11,11,12,0.12)_100%)]"
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
