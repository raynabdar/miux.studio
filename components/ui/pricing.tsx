"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, CheckCheck, Database, Server, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";

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

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    description:
      "Strategic clarity, brand identity, and focused web properties engineered for high-calibre execution.",
    price: 2400,
    yearlyPrice: 1950,
    buttonText: "Book a call",
    buttonVariant: "outline",
    features: [
      { text: "Core Brand Identity & Web Property", icon: <Briefcase size={18} /> },
      { text: "High-Performance Responsive Architecture", icon: <Database size={18} /> },
      { text: "Integrated Analytics & SEO Tuning", icon: <Server size={18} /> },
    ],
    includes: [
      "Starter includes:",
      "End-to-end design system architecture",
      "Fully responsive, accessible build",
      "Integrated analytics & performance tuning",
      "Direct senior partner collaboration",
      "Post-launch warranty & onboarding",
    ],
  },
  {
    name: "Growth",
    description:
      "Comprehensive design and engineering engineered to accelerate market capture and conversion.",
    price: 4800,
    yearlyPrice: 3900,
    buttonText: "Book a call",
    buttonVariant: "default",
    popular: true,
    features: [
      { text: "Complete Brand & Multi-Surface Platform", icon: <Briefcase size={18} /> },
      { text: "Custom CMS & Headless Architecture", icon: <Database size={18} /> },
      { text: "Targeted Campaign Rollout & Ads", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Multi-surface web application platform",
      "Advanced interactive motions & micro-interactions",
      "Conversion rate optimization (CRO) setup",
      "Targeted campaign collateral & ad creatives",
      "Bi-weekly strategic sprint reviews",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Embedded creative and engineering partnership for global brands demanding category dominance.",
    price: 8900,
    yearlyPrice: 7200,
    buttonText: "Book a call",
    buttonVariant: "outline",
    features: [
      { text: "Full-Spectrum Design & Dev Squad", icon: <Briefcase size={18} /> },
      { text: "High-Velocity Custom Software Engineering", icon: <Database size={18} /> },
      { text: "Priority SLA & Multi-Region Support", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Growth, plus:",
      "Omnichannel performance ads & campaign rollout",
      "Multi-region localization across Asia and UAE",
      "Priority SLA with 24/7 dedicated support",
      "Continuous optimization & iteration sprints",
      "Direct Slack/Teams private studio channel",
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
      <div className="relative z-10 flex w-fit items-center rounded-full bg-[#1A1A1A] border border-white/[0.08] p-1.5">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 sm:h-11 rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center select-none",
            !isYearly
              ? "text-[#141414] font-semibold"
              : "text-[#A3A3A3] hover:text-white"
          )}
        >
          {!isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-white"
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
              ? "text-[#141414] font-semibold"
              : "text-[#A3A3A3] hover:text-white"
          )}
        >
          {isYearly && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            Annual Partnership
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold transition-colors",
                isYearly
                  ? "bg-[#141414]/15 text-[#141414] border border-[#141414]/20"
                  : "bg-white/[0.1] text-white border border-white/[0.12]"
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
  description = "Trusted by global corporations and brands at scale. We partner with ambitious leaders across Asia and the UAE. Explore which tier is right for your growth.",
  plans = DEFAULT_PLANS,
  className = "",
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
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
        "relative bg-[#141414] py-24 sm:py-32 px-5 text-white overflow-hidden border-t border-white/[0.04]",
        className
      )}
      ref={pricingRef}
    >
      <div className="mx-auto max-w-7xl">
        <article className="text-left mb-12 sm:mb-16 space-y-5 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
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
            className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl leading-relaxed"
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
          </TimelineContent>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
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
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-300",
                    isPopular
                      ? "border border-white/[0.22] bg-[#202020] text-white ring-1 ring-white/[0.15]"
                      : "border border-white/[0.08] bg-[#1A1A1A] text-white hover:border-white/[0.16]"
                  )}
                >
                  <CardHeader className="p-0 text-left mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#141414]">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#A3A3A3] leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>

                    {/* Fixed, Clear Price Display Without Number Scramble */}
                    <div className="mt-5 flex flex-col">
                      <div className="flex items-baseline">
                        <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                          ${currentPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-[#707070] ml-2 font-medium">
                          /month
                        </span>
                      </div>
                      <div className="mt-1.5 min-h-[22px]">
                        {isYearly ? (
                          <span className="text-xs font-medium text-orange-400">
                            Save 20% (${(plan.yearlyPrice * 12).toLocaleString()} billed annually)
                          </span>
                        ) : (
                          <span className="text-xs text-[#707070]">
                            Billed monthly · Cancel or pause anytime
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 flex flex-col flex-1 justify-between">
                    <div>
                      {/* CTA Button -> Links to /meeting */}
                      <a
                        href="/meeting"
                        aria-label={`Book a call for ${plan.name} plan`}
                        className={cn(
                          "w-full py-3.5 px-4 rounded-xl text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2 mb-6 transition-all duration-200 select-none group",
                          isPopular
                            ? "bg-white text-[#141414] hover:bg-white/90 active:scale-[0.99]"
                            : "border border-white/[0.15] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.25] active:scale-[0.99]"
                        )}
                      >
                        <span>{plan.buttonText || "Book a call"}</span>
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>

                      {/* Highlighted key features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-3 mb-6 pb-6 border-b border-white/[0.08]">
                          {plan.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-3 text-sm text-[#E5E5E5]"
                            >
                              <span className="text-[#A3A3A3] flex-shrink-0">
                                {feat.icon}
                              </span>
                              <span className="font-medium text-[#D4D4D4]">
                                {feat.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Includes list */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                        {plan.includes[0]}
                      </h4>
                      <ul className="space-y-2.5">
                        {plan.includes.slice(1).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="h-5 w-5 rounded-full bg-white/[0.08] border border-white/[0.12] grid place-content-center flex-shrink-0 mt-0.5 mr-3">
                              <CheckCheck className="h-3.5 w-3.5 text-white" />
                            </span>
                            <span className="text-sm text-[#A3A3A3] leading-relaxed">
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
      </div>
    </section>
  );
}

export { PricingSection5 as Pricing };
