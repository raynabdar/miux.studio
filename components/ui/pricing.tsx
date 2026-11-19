"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { BlurRevealTitle } from "@/components/ui/blur-reveal-title";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import Link from "next/link";

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

// annual price is the discounted monthly rate that is actually billed each month
const annualMonthly = (monthly: number) => Math.round(monthly * (1 - ANNUAL_DISCOUNT));

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    description: "Brand identity and modern web build for emerging businesses.",
    price: 2400,
    yearlyPrice: annualMonthly(2400),
    buttonText: "Book a call",
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
    description: "Full-scale web platform engineered to drive conversions and growth.",
    price: 4800,
    yearlyPrice: annualMonthly(4800),
    buttonText: "Book a call",
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
    description: "Dedicated design and engineering squad for category leaders.",
    price: 8900,
    yearlyPrice: annualMonthly(8900),
    buttonText: "Book a call",
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

const PricingSwitch = ({
  isYearly,
  onChange,
  className,
}: {
  isYearly: boolean;
  onChange: (yearly: boolean) => void;
  className?: string;
}) => {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="relative z-10 flex w-fit items-center rounded-full bg-[#ECEAE3] border border-[#141414]/[0.10] p-1.5">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 sm:h-11 rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center select-none",
            !isYearly
              ? "text-[#F6F5F0] font-semibold"
              : "text-[#5C5A55] hover:text-[#141414]"
          )}
        >
          {!isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-[#141414]"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10">Monthly Retainer</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 sm:h-11 rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center select-none gap-2",
            isYearly
              ? "text-[#F6F5F0] font-semibold"
              : "text-[#5C5A55] hover:text-[#141414]"
          )}
        >
          {isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-[#141414]"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            Annual Partnership
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold transition-colors",
                isYearly
                  ? "bg-white/20 text-[#F6F5F0] border border-white/25"
                  : "bg-[#141414]/[0.08] text-[#141414] border border-[#141414]/[0.12]"
              )}
            >
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection5({
  title = "We've got a plan that's engineered for your growth",
  description = "Three ways to work with us. Each tier is scoped in writing before work starts, with a fixed monthly rate and no hourly billing.",
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
        delay: i * 0.15,
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
        "relative bg-[#F6F5F0] py-24 sm:py-32 px-5 text-[#141414] overflow-hidden",
        className
      )}
      ref={pricingRef}
    >
      <div className="mx-auto max-w-7xl">
        <article className="text-center mx-auto mb-12 sm:mb-16 space-y-5 max-w-3xl flex flex-col items-center justify-center">
          <BlurRevealTitle as="h2" className="text-3xl font-semibold tracking-tight text-[#141414] sm:text-5xl lg:text-6xl text-center flex justify-center">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              {title}
            </VerticalCutReveal>
          </BlurRevealTitle>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-base sm:text-lg text-[#5C5A55] max-w-2xl leading-relaxed"
          >
            {description}
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <PricingSwitch isYearly={isYearly} onChange={setIsYearly} className="w-fit" />
            <p className="mt-3 text-xs text-[#78756E]">
              Prices in USD, excluding applicable taxes.
            </p>
          </TimelineContent>
        </article>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            const currentPrice = isYearly ? plan.yearlyPrice : plan.price;

            return (
              <TimelineContent
                key={plan.name}
                as="div"
                animationNum={2 + index}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="relative h-full"
              >
                <Card
                  className="group/plan relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#141414]/[0.10] bg-white/75 p-6 text-[#141414] shadow-[0_20px_50px_-28px_rgba(20,20,20,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 hover:border-[#141414]/[0.2] hover:bg-white/90 sm:p-8"
                >
                  {/* Top Specular Glass Rim */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10"
                  />

                  {/* Plan gradient wash: subtle warm porcelain → orange */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-3xl z-0",
                      isPopular
                        ? "bg-[linear-gradient(135deg,rgba(239,68,68,0.08)_0%,rgba(249,115,22,0.12)_100%)]"
                        : "bg-[linear-gradient(135deg,rgba(20,20,20,0.02)_0%,rgba(249,115,22,0.07)_100%)]"
                    )}
                  />

                  {/* Top Progressive Blur inside Glass Plan Card */}
                  <ProgressiveBlur
                    direction="top"
                    blurLayers={8}
                    blurIntensity={0.8}
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-3xl z-0"
                  />

                  {/* Bottom Progressive Blur inside Glass Plan Card */}
                  <ProgressiveBlur
                    direction="bottom"
                    blurLayers={10}
                    blurIntensity={0.95}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-36 rounded-b-3xl z-0"
                  />

                  <CardHeader className="relative z-10 p-0 text-left mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414]">
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <span className="rounded-full bg-[#141414] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F6F5F0]">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5C5A55] leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>

                    {/* Fixed, Clear Price Display Without Number Scramble */}
                    <div className="mt-5 flex flex-col">
                      <div className="flex items-baseline">
                        <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#141414]">
                          {usd.format(currentPrice)}
                        </span>
                        <span className="text-sm text-[#5C5A55] ml-2 font-medium">
                          /month
                        </span>
                      </div>
                      <div className="mt-1.5 min-h-[22px]">
                        {isYearly ? (
                          <span className="text-xs font-medium text-orange-600">
                            Save {Math.round(ANNUAL_DISCOUNT * 100)}% ({usd.format(plan.yearlyPrice * 12)} billed annually)
                          </span>
                        ) : (
                          <span className="text-xs text-[#78756E]">
                            Billed monthly · Pause or cancel at the end of any billing cycle
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 p-0 flex flex-col flex-1 justify-between">
                    <div>
                      {/* CTA Button -> Links to /meeting */}
                      <Link
                        href="/meeting"
                        aria-label={`Book a call for ${plan.name} plan`}
                        className={cn(
                          "w-full py-3.5 px-4 rounded-xl text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2 mb-6 transition-all duration-200 select-none group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                          isPopular
                            ? "border border-orange-600/20 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_6px_20px_-6px_rgba(234,88,12,0.45)] hover:brightness-105 active:scale-[0.99]"
                            : "border border-[#141414]/[0.14] bg-[#141414] text-[#F6F5F0] hover:bg-[#262626] active:scale-[0.99]"
                        )}
                      >
                        <span>{plan.buttonText || "Book a call"}</span>
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      {/* Highlighted key features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-3 mb-6 pb-6 border-b border-[#141414]/[0.08]">
                          {plan.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-3 text-sm text-[#141414]"
                            >
                              <span className="text-[#5C5A55] flex-shrink-0">
                                {feat.icon}
                              </span>
                              <span className="font-medium text-[#2E2D2A]">
                                {feat.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Includes list */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78756E]">
                        {plan.includes[0]}
                      </h4>
                      <ul className="space-y-2.5">
                        {plan.includes.slice(1).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="h-5 w-5 rounded-full bg-[#141414]/[0.06] border border-[#141414]/[0.10] grid place-content-center flex-shrink-0 mt-0.5 mr-3">
                              <CheckCheck className="h-3.5 w-3.5 text-[#141414]" />
                            </span>
                            <span className="text-sm text-[#5C5A55] leading-relaxed">
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

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#141414]/[0.10] bg-white/80 px-6 py-5 shadow-sm">
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
            <table className="w-full min-w-[460px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of Starter, Growth and Enterprise retainer tiers
              </caption>
              <thead>
                <tr className="border-b border-[#141414]/[0.10] text-xs uppercase tracking-[0.14em] text-[#78756E]">
                  <th scope="col" className="py-3 pr-4 font-medium">Included</th>
                  {plans.map((plan) => (
                    <th scope="col" key={plan.name} className="px-2.5 py-3 font-medium text-[#141414]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/[0.07] text-[#5C5A55]">
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Monthly retainer</th>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-2.5 py-3 tabular-nums">{usd.format(plan.price)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Annual (per month)</th>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-2.5 py-3 tabular-nums">
                      {usd.format(plan.yearlyPrice)}
                      <span className="ml-1 text-xs text-orange-600">save {Math.round(ANNUAL_DISCOUNT * 100)}%</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Brand system &amp; UI kit</th>
                  <td className="px-2.5 py-3">Yes</td>
                  <td className="px-2.5 py-3">Yes, extended</td>
                  <td className="px-2.5 py-3">Yes, multi-brand</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Web build</th>
                  <td className="px-2.5 py-3">Responsive marketing site</td>
                  <td className="px-2.5 py-3">Multi-page platform</td>
                  <td className="px-2.5 py-3">Custom application</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">CMS &amp; API integrations</th>
                  <td className="px-2.5 py-3 text-[#78756E]">Not included</td>
                  <td className="px-2.5 py-3">Custom CMS</td>
                  <td className="px-2.5 py-3">Custom + multi-region</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Motion &amp; CRO</th>
                  <td className="px-2.5 py-3">Core optimisation</td>
                  <td className="px-2.5 py-3">Full motion + funnels</td>
                  <td className="px-2.5 py-3">Continuous iteration</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Support</th>
                  <td className="px-2.5 py-3">30 days post-launch</td>
                  <td className="px-2.5 py-3">Bi-weekly reviews</td>
                  <td className="px-2.5 py-3">24/7 priority SLA</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-3 font-medium text-[#141414]">Working channel</th>
                  <td className="px-2.5 py-3">Email + scheduled calls</td>
                  <td className="px-2.5 py-3">Shared project board</td>
                  <td className="px-2.5 py-3">Private Slack channel</td>
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
