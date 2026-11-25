"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/data";

export interface PricingPlanFeature {
  text: string;
  icon?: React.ReactNode;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  buttonText?: string;
  buttonVariant?: "default" | "outline";
  popular?: boolean;
  features: PricingPlanFeature[];
  includes: string[];
}

export interface PricingProps {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  className?: string;
}

export const ANNUAL_DISCOUNT = 0.2;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const annualMonthly = (monthly: number) =>
  Math.round(monthly * (1 - ANNUAL_DISCOUNT));

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    description:
      "Brand identity and modern web build for emerging businesses ready to launch fast.",
    price: 2400,
    yearlyPrice: annualMonthly(2400),
    buttonText: "Get started",
    buttonVariant: "outline",
    features: [
      { text: "Brand Identity & Design System", icon: <Briefcase size={18} /> },
      { text: "Responsive Next.js Architecture", icon: <Database size={18} /> },
      { text: "Core SEO & Speed Optimization", icon: <Server size={18} /> },
    ],
    includes: [
      "Starter includes:",
      "Custom brand system & UI kit",
      "Full responsive web build",
      "Analytics & performance tuning",
      "Direct senior partner lead",
      "30-day post-launch support",
    ],
  },
  {
    name: "Growth",
    description:
      "Full-scale web platform engineered to drive conversions, motion, and sustained growth.",
    price: 4800,
    yearlyPrice: annualMonthly(4800),
    buttonText: "Get started",
    buttonVariant: "default",
    popular: true,
    features: [
      { text: "Full Brand & Web Application", icon: <Briefcase size={18} /> },
      { text: "Custom CMS & API Integrations", icon: <Database size={18} /> },
      { text: "Conversion Optimization & Motion", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Multi-page custom platform",
      "Interactive motion design",
      "CRO & funnel setup",
      "Campaign assets & templates",
      "Bi-weekly strategic reviews",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Dedicated design and engineering squad with priority SLA for category leaders.",
    price: 8900,
    yearlyPrice: annualMonthly(8900),
    buttonText: "Get started",
    buttonVariant: "outline",
    features: [
      { text: "Dedicated Product Team", icon: <Briefcase size={18} /> },
      { text: "Custom Software Engineering", icon: <Database size={18} /> },
      { text: "24/7 Priority SLA & Support", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Growth, plus:",
      "Custom application build",
      "Multi-region localization",
      "24/7 priority SLA support",
      "Continuous sprint iteration",
      "Private studio Slack channel",
    ],
  },
];

const CUSTOM_DELIVERABLES = [
  "Brand Identity",
  "Web Design",
  "Web Development",
  "UI/UX Design",
  "AI Automation",
  "Ads & Campaigns",
  "Ongoing Retainer",
] as const;

const PRICE_PRESETS = [1500, 3500, 6000, 12000] as const;

function mapPriceToBudgetRange(price: number): string {
  if (price < 5000) return "Under $5,000";
  if (price < 10000) return "$5,000 – $10,000";
  if (price < 25000) return "$10,000 – $25,000";
  if (price < 50000) return "$25,000 – $50,000";
  return "$50,000+";
}

/* Smooth rolling-digit price counter (zero external dependency, SSR-safe) */
function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const formatted = value.toLocaleString("en-US");
  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)}>
      <span>$</span>
      <span className="inline-flex overflow-hidden">
        {formatted.split("").map((char, idx) => (
          <span
            key={`${idx}-${formatted.length}`}
            className="relative inline-block overflow-hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                initial={{ y: "65%", opacity: 0, filter: "blur(3px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-65%", opacity: 0, filter: "blur(3px)" }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                  mass: 0.7,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </span>
  );
}

const PricingSwitch = ({
  isYearly,
  onSwitch,
  className,
}: {
  isYearly: boolean;
  onSwitch: (yearly: boolean) => void;
  className?: string;
}) => {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="relative z-10 flex w-fit rounded-xl border border-[#141414]/[0.10] bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onSwitch(false)}
          className={cn(
            "relative z-10 h-12 w-fit cursor-pointer rounded-xl px-4 py-1 text-sm font-medium transition-colors sm:px-6 sm:py-2 sm:text-base",
            !isYearly
              ? "text-white"
              : "text-[#5C5A55] hover:text-[#141414]"
          )}
        >
          {!isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute left-0 top-0 h-12 w-full rounded-xl border-4 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600 shadow-sm shadow-orange-600/40"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">Monthly Billing</span>
        </button>

        <button
          type="button"
          onClick={() => onSwitch(true)}
          className={cn(
            "relative z-10 h-12 w-fit flex-shrink-0 cursor-pointer rounded-xl px-4 py-1 text-sm font-medium transition-colors sm:px-6 sm:py-2 sm:text-base",
            isYearly
              ? "text-white"
              : "text-[#5C5A55] hover:text-[#141414]"
          )}
        >
          {isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute left-0 top-0 h-12 w-full rounded-xl border-4 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600 shadow-sm shadow-orange-600/40"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            Yearly Billing
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-[#141414]">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

function CustomOfferSection() {
  const [price, setPrice] = useState<number>(3500);
  const [priceText, setPriceText] = useState<string>("3500");
  const [cadence, setCadence] = useState<"project" | "monthly">("project");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Web Design",
    "Web Development",
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const toggleService = (item: string) => {
    setSelectedServices((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handlePriceInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    setPriceText(digits);
    const parsed = Number.parseInt(digits, 10);
    if (!Number.isNaN(parsed)) {
      setPrice(Math.max(0, parsed));
    } else {
      setPrice(0);
    }
  };

  const handleSliderChange = (next: number) => {
    setPrice(next);
    setPriceText(String(next));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback("");

    if (name.trim().length < 2) {
      setStatus("error");
      setFeedback("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }
    if (price < 500) {
      setStatus("error");
      setFeedback("Please set a target budget of at least $500.");
      return;
    }

    setStatus("submitting");

    const servicesSummary =
      selectedServices.length > 0 ? selectedServices.join(", ") : "Custom Scope";
    const composedMessage = [
      `Custom Plan Offer: ${usd.format(price)} (${cadence === "monthly" ? "Monthly retainer" : "One-time project"})`,
      `Selected deliverables: ${servicesSummary}`,
      notes.trim() ? `Project notes: ${notes.trim()}` : "Project notes: Not provided yet.",
    ].join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: "",
          projectType: "Other",
          budget: mapPriceToBudgetRange(price),
          message: composedMessage,
          website: honeypot,
        }),
      });

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        setStatus("error");
        setFeedback(
          payload?.error ||
            `Could not send your custom offer right now. Please write to ${SITE.email}.`
        );
        return;
      }

      setStatus("success");
      setFeedback(
        `Offer received for ${usd.format(price)}. A senior partner will reply within one business day.`
      );
      setName("");
      setEmail("");
      setNotes("");
    } catch {
      setStatus("error");
      setFeedback(
        `Network error while sending your offer. Please write to ${SITE.email} directly.`
      );
    }
  };

  return (
    <div className="relative mt-10 overflow-hidden rounded-3xl border border-[#141414]/[0.12] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(20,20,20,0.14)] sm:p-8 lg:p-10">
      {/* Subtle warm top ambient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_70%)] blur-2xl"
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* Left: Interactive Set-Your-Price Builder */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              <span>Custom Plan · Set Your Price</span>
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#141414] sm:text-3xl">
              Offer us your custom plan &amp; set your price
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5C5A55] sm:text-base">
              Have a specific budget or tailored scope in mind? Propose your price, pick the
              deliverables you need, and we&apos;ll shape a clear sprint around it.
            </p>

            {/* Target Budget Controls */}
            <div className="mt-6 rounded-2xl border border-[#141414]/[0.08] bg-[#F6F5F0]/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="custom-offer-price"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5C5A55]"
                >
                  Your proposed budget (USD)
                </label>

                {/* Cadence Toggle */}
                <div
                  role="group"
                  aria-label="Custom plan billing type"
                  className="inline-flex rounded-lg border border-[#141414]/[0.10] bg-white p-0.5 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setCadence("project")}
                    className={cn(
                      "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
                      cadence === "project"
                        ? "bg-[#141414] text-[#F6F5F0]"
                        : "text-[#5C5A55] hover:text-[#141414]"
                    )}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setCadence("monthly")}
                    className={cn(
                      "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
                      cadence === "monthly"
                        ? "bg-[#141414] text-[#F6F5F0]"
                        : "text-[#5C5A55] hover:text-[#141414]"
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-1.5">
                  <AnimatedPrice
                    value={price}
                    className="text-4xl font-semibold tracking-tight text-[#141414] sm:text-5xl"
                  />
                  <span className="text-sm font-medium text-[#5C5A55]">
                    {cadence === "monthly" ? "/month" : "total"}
                  </span>
                </div>

                {/* Direct numeric input */}
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-sm font-semibold text-[#5C5A55]">
                    $
                  </span>
                  <input
                    id="custom-offer-price"
                    type="text"
                    inputMode="numeric"
                    value={priceText}
                    onChange={(e) => handlePriceInput(e.target.value)}
                    aria-label="Enter custom price in USD"
                    className="w-32 rounded-xl border border-[#141414]/[0.14] bg-white py-2 pl-7 pr-3 text-sm font-semibold tabular-nums text-[#141414] outline-none transition-colors focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Range Slider */}
              <div className="mt-5">
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={250}
                  value={Math.min(Math.max(price, 1000), 25000)}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  aria-label="Slide to choose your custom budget"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#141414]/15 accent-orange-500"
                />
                <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#6B6862] tabular-nums">
                  <span>$1,000</span>
                  <span>$12,500</span>
                  <span>$25,000+</span>
                </div>
              </div>

              {/* Quick preset buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSliderChange(preset)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      price === preset
                        ? "border-orange-500 bg-orange-500 text-[#141414]"
                        : "border-[#141414]/[0.12] bg-white text-[#5C5A55] hover:border-orange-400 hover:text-[#141414]"
                    )}
                  >
                    {usd.format(preset)}
                    {preset === 12000 ? "+" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverables multi-select */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5C5A55]">
                What should your custom plan include?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CUSTOM_DELIVERABLES.map((item) => {
                  const active = selectedServices.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleService(item)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                        active
                          ? "border-orange-500 bg-orange-50 text-orange-800"
                          : "border-[#141414]/[0.12] bg-white text-[#5C5A55] hover:border-[#141414]/30 hover:text-[#141414]"
                      )}
                    >
                      {active && <Check className="size-3 text-orange-600" aria-hidden="true" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Offer Submission Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col justify-between rounded-2xl border border-[#141414]/[0.08] bg-[#F6F5F0]/70 p-5 sm:p-6"
        >
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#141414]">
              Send your custom offer
            </h4>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label
                htmlFor="custom-offer-name"
                className="block text-xs font-medium text-[#5C5A55]"
              >
                Your name
              </label>
              <input
                id="custom-offer-name"
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#141414]/[0.12] bg-white px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#78756E] outline-none transition-colors focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="custom-offer-email"
                className="block text-xs font-medium text-[#5C5A55]"
              >
                Work email
              </label>
              <input
                id="custom-offer-email"
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#141414]/[0.12] bg-white px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#78756E] outline-none transition-colors focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="custom-offer-notes"
                className="block text-xs font-medium text-[#5C5A55]"
              >
                Scope &amp; timeline <span className="text-[#6B6862]">(optional)</span>
              </label>
              <textarea
                id="custom-offer-notes"
                rows={3}
                placeholder="What are we building together and when do you want to launch?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#141414]/[0.12] bg-white px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#78756E] outline-none transition-colors focus:border-orange-500"
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-400 bg-gradient-to-t from-orange-500 to-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Sending offer…</span>
                </>
              ) : (
                <>
                  <span>Offer {usd.format(price)} Custom Plan</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>

            <Link
              href="/meeting"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#141414]/[0.12] bg-white px-4 py-2.5 text-xs font-semibold text-[#141414] transition-colors hover:border-orange-400 hover:bg-orange-50/40"
            >
              <span>Prefer to negotiate live? Book a 45-min call</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>

            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={cn(
                  "flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed",
                  status === "success"
                    ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                    : "border-orange-500/30 bg-orange-50 text-orange-800"
                )}
              >
                {status === "success" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-orange-700" />
                )}
                <span>{feedback}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PricingSection5({
  title = "We've got a plan that's perfect for you",
  description = "Three ways to work with us — or propose your own custom budget below. Every tier is scoped in writing before work starts, with no hourly billing.",
  plans = DEFAULT_PLANS,
  className = "",
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.16,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <section
      id="pricing"
      aria-label="Pricing and plans"
      className={cn(
        "relative scroll-mt-24 overflow-hidden bg-[#F6F5F0] px-5 py-24 text-[#141414] sm:scroll-mt-28 sm:py-32",
        className
      )}
      ref={pricingRef}
    >
      <div className="mx-auto max-w-7xl">
        <article className="mb-10 max-w-2xl space-y-4 text-left sm:mb-12">
          <h2 className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-[#141414] md:text-6xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              {title}
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="max-w-xl text-sm leading-relaxed text-[#5C5A55] md:text-base"
          >
            {description}
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="pt-2"
          >
            <PricingSwitch
              isYearly={isYearly}
              onSwitch={setIsYearly}
              className="w-fit"
            />
            <p className="mt-3 text-xs text-[#78756E]">
              Prices in USD, excluding applicable taxes.
            </p>
          </TimelineContent>
        </article>

        {/* 3 Standard Tiers */}
        <div className="grid gap-5 py-4 md:grid-cols-3">
          {plans.map((plan, index) => {
            const isPopular = Boolean(plan.popular);
            const currentPrice = isYearly ? plan.yearlyPrice : plan.price;

            return (
              <TimelineContent
                key={plan.name}
                as="div"
                animationNum={2 + index}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300",
                    isPopular
                      ? "border-orange-300 bg-orange-50/90 ring-2 ring-orange-500 shadow-[0_24px_60px_-28px_rgba(249,115,22,0.3)]"
                      : "border-[#141414]/[0.10] bg-white shadow-[0_16px_44px_-28px_rgba(20,20,20,0.14)] hover:border-[#141414]/[0.2]"
                  )}
                >
                  {/* Subtle top/bottom progressive blur polish */}
                  <ProgressiveBlur
                    direction="top"
                    blurLayers={5}
                    blurIntensity={0.4}
                    className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20 rounded-t-2xl"
                  />
                  <ProgressiveBlur
                    direction="bottom"
                    blurLayers={5}
                    blurIntensity={0.45}
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 rounded-b-2xl"
                  />

                  <CardHeader className="relative z-10 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="mb-2 text-2xl font-semibold text-[#141414] xl:text-3xl">
                        {plan.name} Plan
                      </h3>
                      {isPopular && (
                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mb-4 min-h-[42px] text-sm leading-relaxed text-[#5C5A55]">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline">
                      <AnimatedPrice
                        value={currentPrice}
                        className="text-4xl font-semibold tracking-tight text-[#141414]"
                      />
                      <span className="ml-1.5 text-sm font-medium text-[#5C5A55]">
                        /month
                      </span>
                    </div>
                    <p className="mt-1.5 min-h-[20px] text-xs">
                      {isYearly ? (
                        <span className="font-medium text-orange-700">
                          Save {Math.round(ANNUAL_DISCOUNT * 100)}% (
                          {usd.format(plan.yearlyPrice * 12)} billed annually)
                        </span>
                      ) : (
                        <span className="text-[#6B6862]">
                          Billed monthly · Pause or cancel anytime
                        </span>
                      )}
                    </p>
                  </CardHeader>

                  <CardContent className="relative z-10 flex flex-1 flex-col justify-between pt-0">
                    <div>
                      {/* Primary glossy gradient CTA */}
                      <Link
                        href="/meeting"
                        aria-label={`Get started with ${plan.name} Plan`}
                        className={cn(
                          "mb-3 flex w-full items-center justify-center gap-2 rounded-xl p-3.5 text-base font-semibold transition-all duration-200 active:scale-[0.99] sm:text-lg",
                          isPopular
                            ? "border border-orange-400 bg-gradient-to-t from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/35 hover:brightness-105"
                            : "border border-neutral-700 bg-gradient-to-t from-neutral-900 to-neutral-700 text-white shadow-lg shadow-neutral-900/20 hover:brightness-110"
                        )}
                      >
                        <span>{plan.buttonText || "Get started"}</span>
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>

                      {/* Secondary clean white button */}
                      <Link
                        href="/contact"
                        aria-label={`Talk to sales about ${plan.name} Plan`}
                        className="mb-6 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-semibold text-[#141414] shadow-md shadow-black/[0.04] transition-all hover:border-orange-400/60 hover:bg-orange-50/40 sm:text-base"
                      >
                        Talk to Sales
                      </Link>

                      {/* Core pillar highlights */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mb-5 space-y-2.5 border-t border-neutral-200/80 pt-4">
                          {plan.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2.5 text-sm text-[#2E2D2A]"
                            >
                              <span className="shrink-0 text-orange-700">
                                {feat.icon}
                              </span>
                              <span className="font-medium">{feat.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-3 border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#141414]">
                        Features
                      </h4>
                      <p className="text-sm font-medium text-[#141414]">
                        {plan.includes[0]}
                      </p>
                      <ul className="space-y-2.5 font-medium">
                        {plan.includes.slice(1).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className="mr-3 grid size-6 shrink-0 place-content-center rounded-full border border-orange-500 bg-white">
                              <CheckCheck className="size-3.5 text-orange-500" />
                            </span>
                            <span className="text-sm text-[#5C5A55]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>
            );
          })}
        </div>

        {/* Custom Plan: Offer Us Your Custom Plan & Set Your Price */}
        <CustomOfferSection />

        {/* Compare What Is Included In Each Tier */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#141414]/[0.10] bg-white px-6 py-5 shadow-sm">
          <button
            type="button"
            aria-expanded={compareOpen}
            aria-controls="pricing-compare"
            onClick={() => setCompareOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            <span>Compare what is included in each tier</span>
            <motion.span
              aria-hidden="true"
              animate={{ rotate: compareOpen ? 45 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-none text-orange-600"
            >
              +
            </motion.span>
          </button>

          <motion.div
            id="pricing-compare"
            aria-hidden={!compareOpen}
            initial={false}
            animate={{
              height: compareOpen ? "auto" : 0,
              opacity: compareOpen ? 1 : 0,
            }}
            transition={{
              height: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.4, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{
                filter: compareOpen ? "blur(0px)" : "blur(14px)",
                y: compareOpen ? 0 : 10,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 overflow-x-auto"
            >
              <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Comparison of Starter, Growth, Enterprise, and Custom plans
                </caption>
                <thead>
                  <tr className="border-b border-[#141414]/[0.10] text-xs uppercase tracking-[0.14em] text-[#78756E]">
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Included
                    </th>
                    {plans.map((plan) => (
                      <th
                        scope="col"
                        key={plan.name}
                        className="px-2.5 py-3 font-medium text-[#141414]"
                      >
                        {plan.name}
                      </th>
                    ))}
                    <th scope="col" className="px-2.5 py-3 font-medium text-orange-700">
                      Custom
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/[0.07] text-[#5C5A55]">
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Monthly retainer
                    </th>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-2.5 py-3 tabular-nums">
                        {usd.format(plan.price)}
                      </td>
                    ))}
                    <td className="px-2.5 py-3 font-medium text-orange-700">
                      Set your price
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Annual (per month)
                    </th>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-2.5 py-3 tabular-nums">
                        {usd.format(plan.yearlyPrice)}
                        <span className="ml-1 text-xs text-orange-700">
                          save {Math.round(ANNUAL_DISCOUNT * 100)}%
                        </span>
                      </td>
                    ))}
                    <td className="px-2.5 py-3">Flexible</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Brand system &amp; UI kit
                    </th>
                    <td className="px-2.5 py-3">Yes</td>
                    <td className="px-2.5 py-3">Yes, extended</td>
                    <td className="px-2.5 py-3">Yes, multi-brand</td>
                    <td className="px-2.5 py-3">Optional</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Web build
                    </th>
                    <td className="px-2.5 py-3">Responsive marketing site</td>
                    <td className="px-2.5 py-3">Multi-page platform</td>
                    <td className="px-2.5 py-3">Custom application</td>
                    <td className="px-2.5 py-3">Scoped to budget</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      CMS &amp; API integrations
                    </th>
                    <td className="px-2.5 py-3 text-[#78756E]">Not included</td>
                    <td className="px-2.5 py-3">Custom CMS</td>
                    <td className="px-2.5 py-3">Custom + multi-region</td>
                    <td className="px-2.5 py-3">As requested</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Motion &amp; CRO
                    </th>
                    <td className="px-2.5 py-3">Core optimisation</td>
                    <td className="px-2.5 py-3">Full motion + funnels</td>
                    <td className="px-2.5 py-3">Continuous iteration</td>
                    <td className="px-2.5 py-3">Pick &amp; choose</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Support
                    </th>
                    <td className="px-2.5 py-3">30 days post-launch</td>
                    <td className="px-2.5 py-3">Bi-weekly reviews</td>
                    <td className="px-2.5 py-3">24/7 priority SLA</td>
                    <td className="px-2.5 py-3">Agreed per offer</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">
                      Working channel
                    </th>
                    <td className="px-2.5 py-3">Email + scheduled calls</td>
                    <td className="px-2.5 py-3">Shared project board</td>
                    <td className="px-2.5 py-3">Private Slack channel</td>
                    <td className="px-2.5 py-3">Direct partner line</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { PricingSection5 as Pricing };
