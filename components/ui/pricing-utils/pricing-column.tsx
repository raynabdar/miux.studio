import React from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingColumnProps {
  name: string;
  icon?: React.ReactNode;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  promotionText?: string;
  priceNote?: string;
  cta?: {
    variant?: "default" | "glow" | "glow-brand" | "outline" | "secondary";
    label: string;
    href: string;
  };
  features: string[];
  variant?: "default" | "glow" | "glow-brand";
  className?: string;
  badge?: string;
}

export function PricingColumn({
  name,
  icon,
  description,
  price,
  originalPrice,
  promotionText,
  priceNote,
  cta = {
    variant: "default",
    label: "Get all-access",
    href: "/contact",
  },
  features,
  variant = "default",
  className,
  badge,
}: PricingColumnProps) {
  const isGlowBrand = variant === "glow-brand";
  const isGlow = variant === "glow" || isGlowBrand;
  const displayPrice = typeof price === "number" ? `$${price}` : price;
  const displayOriginalPrice =
    typeof originalPrice === "number" ? `$${originalPrice}` : originalPrice;
  const buttonLabel = cta?.label || "Get started";
  const buttonHref = cta?.href || "/contact";

  return (
    <article
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5",
        isGlowBrand
          ? "border-orange-500/40 bg-white/[0.05] hover:border-orange-500/70 shadow-none"
          : isGlow
            ? "border-white/[0.25] bg-white/[0.04] shadow-none hover:border-white/40"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]",
        className
      )}
    >
      {/* Badge */}
      {(badge || isGlowBrand) && (
        <span
          className={cn(
            "absolute -top-3 left-8 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
            isGlowBrand
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-black/30"
              : "bg-white text-[#141414]"
          )}
        >
          {badge || (isGlowBrand ? "Most Popular" : "Featured")}
        </span>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            {icon && (
              <span
                className={cn(
                  "shrink-0",
                  isGlowBrand ? "text-orange-400" : "text-[#A3A3A3]"
                )}
              >
                {icon}
              </span>
            )}
            {name}
          </h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
          {description}
        </p>

        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white">
              {displayPrice}
            </span>
            {displayOriginalPrice && (
              <span className="text-lg line-through text-[#707070]">
                {displayOriginalPrice}
              </span>
            )}
            {priceNote && (
              <span className="text-xs text-[#707070] ml-1">{priceNote}</span>
            )}
          </div>
          {promotionText && (
            <p className="mt-1 text-xs text-orange-400 font-medium">
              {promotionText}
            </p>
          )}
        </div>

        {/* Feature List */}
        <ul className="mt-8 space-y-3.5 text-sm text-[#A3A3A3]">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check
                className={cn(
                  "size-4 shrink-0 mt-0.5",
                  isGlowBrand ? "text-orange-400" : "text-white"
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <a
          href={buttonHref}
          aria-label={`Select ${name} plan - ${buttonLabel}`}
          title={`Choose ${name} tier`}
          className={cn(
            "group flex w-full items-center justify-center gap-1.5 rounded-full py-3.5 text-sm font-semibold transition-all duration-300",
            isGlowBrand
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm hover:from-orange-600 hover:to-orange-700 active:scale-98"
              : isGlow
                ? "bg-white text-[#141414] hover:bg-white/90 active:scale-98"
                : "border border-white/[0.12] bg-[#141414] text-white hover:border-white/30 hover:bg-white/[0.04] active:scale-98"
          )}
        >
          <span>{buttonLabel}</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
}
