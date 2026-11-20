"use client";

import { GLSLHills } from "@/components/GLSLHills";
import { HeroMedia } from "@/components/HeroMedia";
import { CompanyCardMarquee } from "@/components/LogoMarquee";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { Footer, Navbar } from "@/components/site-shell";
import { BlurRevealTitle } from "@/components/ui/blur-reveal-title";
import { ClutchWidget } from "@/components/ui/clutch-widget";
import FAQs from "@/components/ui/faqs-component";
import Pricing from "@/components/ui/pricing";
import ProgressMetricCard from "@/components/ui/progress-metric-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import Testimonials from "@/components/ui/testimonial";
import { faqs, projects, STATS, type Project } from "@/lib/data";
import { testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

/* ── Animation variants ─────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const FOUNDER_AVATARS = testimonials.slice(0, 4);

/* ───────────────────────────────────────────────────────────────────── */
/*  2. HERO (id="home")                                                  */
/* ───────────────────────────────────────────────────────────────────── */

function StudioClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Dhaka",
        }).format(new Date()),
      );
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return <span className="text-[#5C5A55]">Dhaka time</span>;

  return (
    <span className="tabular-nums text-[#141414]/80">
      <time dateTime={new Date().toISOString()}>{time}</time>
    </span>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const cursorLightRef = useRef<HTMLDivElement | null>(null);
  const pointerRafRef = useRef<number>(0);
  const [heroHovered, setHeroHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const etherOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.85, 0]);

  useEffect(() => {
    return () => {
      if (pointerRafRef.current) {
        window.cancelAnimationFrame(pointerRafRef.current);
      }
    };
  }, []);

  // Dynamic month: changes dynamically after month ends (e.g. 'November')
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Websites for Brands and Digital Businesses"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHeroHovered(true);
      }}
      onPointerLeave={() => setHeroHovered(false)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const target = event.currentTarget;
        const clientX = event.clientX;
        const clientY = event.clientY;
        if (pointerRafRef.current) return;
        pointerRafRef.current = window.requestAnimationFrame(() => {
          pointerRafRef.current = 0;
          const light = cursorLightRef.current;
          if (!light) return;
          const rect = target.getBoundingClientRect();
          light.style.setProperty("--cursor-x", `${clientX - rect.left}px`);
          light.style.setProperty("--cursor-y", `${clientY - rect.top}px`);
        });
      }}
      className="relative flex min-h-[85vh] lg:min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F6F5F0] px-4 sm:px-5 pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* Crisp Background Image + LiquidEther (Header top to Hero bottom) + Warm Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden bg-[#F6F5F0]"
        aria-hidden="true"
      >
        <HeroMedia />

        {/* Slow, smooth, SEO-friendly LiquidEther spanning from top of header to bottom of hero,
            dissolving smoothly at the bottom edge and fading out cleanly as you scroll past the hero */}
        <motion.div
          style={{ opacity: etherOpacity }}
          className="absolute inset-0 pointer-events-none will-change-[opacity] [mask-image:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)]"
        >
          <LiquidEther
            colors={["#ea580c", "#fb923c", "#fdba74"]}
            lightMode
            backgroundColor="transparent"
            intensity={0.9}
            mouseForce={12}
            cursorSize={120}
            persistence={0.82}
            viscosity={0.38}
            resolution={0.32}
            maxDevicePixelRatio={1.5}
            autoDemo
            autoSpeed={0.22}
            autoIntensity={1.5}
            autoResumeDelay={1400}
            intro
            className="h-full w-full opacity-90"
          />
        </motion.div>

        {/* Cursor-reactive warm light — isolated ref so pointer movement never recalculates hero subtree */}
        <div
          ref={cursorLightRef}
          className={cn(
            "absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--cursor-x,50%)_var(--cursor-y,40%),rgba(249,115,22,0.14),transparent_65%)] transition-opacity duration-700 ease-out will-change-[opacity]",
            heroHovered ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Layered Orange Mesh Gradient Orbs for warm depth */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14)_0%,rgba(234,88,12,0.05)_45%,transparent_70%)]" />
        <div className="absolute top-[20%] left-[8%] w-[500px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.09)_0%,transparent_65%)]" />
        <div className="absolute top-[24%] right-[8%] w-[520px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.09)_0%,transparent_65%)]" />

        {/* Ambient Off-White Gradation resolving cleanly into #F6F5F0 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#F6F5F0_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F5F0]/55 via-[#F6F5F0]/25 to-[#F6F5F0]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <div className="flex w-full flex-col items-center text-center">
          {/* Founder Avatars Pill — transparent with progressive blur */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mb-4 max-w-full sm:mb-5"
          >
            <Link
              href="/startups"
              aria-label={`See the ${STATS.founders}+ startups and businesses that work with Miux Studio`}
              className="group relative inline-flex max-w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#141414]/[0.12] bg-transparent px-3 py-1.5 shadow-[0_10px_30px_-14px_rgba(20,20,20,0.14)] backdrop-blur-xl transition-all duration-300 hover:border-orange-500/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 sm:gap-3.5 sm:px-4 sm:py-2"
            >
              {/* Progressive blur layers inside transparent pill */}
              <ProgressiveBlur
                direction="top"
                blurLayers={5}
                blurIntensity={0.45}
                className="pointer-events-none absolute inset-0 rounded-full"
              />
              <ProgressiveBlur
                direction="bottom"
                blurLayers={5}
                blurIntensity={0.45}
                className="pointer-events-none absolute inset-0 rounded-full"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-white/10"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />

              <span className="relative z-10 flex shrink-0 -space-x-2" aria-hidden="true">
                {FOUNDER_AVATARS.map((person, index) => (
                  <span
                    key={person.id}
                    className={cn(
                      "relative grid size-7 place-items-center overflow-hidden rounded-full border-2 border-white/85 text-[10px] font-semibold text-white transition-transform duration-300 ease-out hover:z-10 hover:scale-110 sm:size-8",
                      index % 2 === 0
                        ? "bg-gradient-to-br from-orange-500 to-amber-600"
                        : "bg-gradient-to-br from-[#2E2D2A] to-[#141414]",
                    )}
                    style={{ zIndex: FOUNDER_AVATARS.length - index }}
                  >
                    {initialsOf(person.name)}
                  </span>
                ))}
              </span>
              <span className="relative z-10 flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] font-medium text-[#141414] sm:gap-x-2 sm:text-sm">
                <span className="font-semibold tracking-tight text-[#141414]">
                  {STATS.founders}+ Startups &amp; Founders
                </span>
                <span className="text-[#5C5A55]">Choose Miux Studio</span>
                <span className="ml-0.5 inline-flex items-center text-[10px] text-orange-600 sm:text-xs">
                  ★★★★★
                </span>
              </span>
            </Link>
          </motion.div>

          {/* Live availability — sits directly beneath the Startups & Founders pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.16,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-10 inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-[#5C5A55] select-none sm:mb-14"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-600" />
            </span>
            <span>
              Taking new projects for{" "}
              <strong className="font-semibold text-[#141414]">
                &apos;{currentMonth}&apos;
              </strong>
            </span>
          </motion.div>

          {/* SEO-Optimized Hero Heading: Websites for Brands & Digital Businesses */}
          <div className="overflow-hidden max-w-5xl px-1">
            <motion.h1
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-[34px] leading-[1.06] font-semibold tracking-[-0.05em] sm:tracking-[-0.06em] text-[#141414] sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.95]"
            >
              Websites for Brands &amp; Digital Businesses
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="mt-5 sm:mt-6 max-w-2xl px-2 text-sm text-[#5C5A55] sm:text-lg md:text-xl font-normal leading-relaxed"
          >
            Get a website or custom business website that fulfils your goals and
            drives sales.
          </motion.p>

          {/* Action Buttons */}
          <div className="mt-7 sm:mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
            <ShinyButton
              href="/meeting"
              label="Book a 45-min call"
              fillColor="#141414"
              labelColor="#F6F5F0"
              aria-label="Book a 45-minute discovery call with Miux Studio"
              title="Schedule a consultation call with Miux Studio"
              className="w-full max-w-[280px] sm:max-w-none sm:w-auto group shadow-[0_10px_28px_-10px_rgba(20,20,20,0.35)]"
            >
              <span className="inline-flex items-center gap-2">
                <span>Book a 45-min call</span>
                <ArrowUpRight
                  className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </ShinyButton>
          </div>

          {/* Studio location & live Dhaka time — placed after Hero CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#5C5A55] select-none"
          >
            <span>Dhaka</span>
            <span aria-hidden="true" className="text-[#141414]/35">
              ·
            </span>
            <StudioClock />
          </motion.div>

          {/* Official Clutch Widget */}
          <ClutchWidget />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  3. ABOUT (id="about")                                                */
/* ───────────────────────────────────────────────────────────────────── */

const ABOUT_STATEMENT_WORDS = [
  "We",
  "are",
  "a",
  "creative",
  "studio",
  "based",
  "in",
  "Bangladesh,",
  "working",
  "with",
  "teams",
  "across",
  "APAC",
  "and",
  "the",
  "UAE.",
  "We",
  "connect",
  "premium",
  "visual",
  "design",
  "with",
  "technical",
  "excellence.",
];

function ScrollWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Smooth word-by-word scroll unblur:
  // Starts visibly blurred (14px) and dims to 0.2
  // When scroll advances through the section, each word progressively unblurs to blur(0px) and full opacity
  const step = 0.52 / total;
  const start = 0.16 + index * step;
  const end = start + step * 1.8;

  const opacity = useTransform(
    progress,
    [start - 0.04, start, end],
    [0.2, 0.45, 1],
  );
  const blurPx = useTransform(progress, [start - 0.04, start, end], [14, 8, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${Math.max(0, v)}px)`);
  const y = useTransform(progress, [start - 0.04, start, end], [12, 6, 0]);

  const isGradient =
    word.includes("creative") ||
    word.includes("Bangladesh") ||
    word.includes("APAC") ||
    word.includes("UAE") ||
    word.includes("excellence");

  return (
    <motion.span
      style={{ opacity, filter, y }}
      className={cn(
        "inline-block mr-[0.24em] transition-colors",
        isGradient
          ? "text-transparent bg-clip-text bg-gradient-to-r from-[#141414] via-[#4A2511] via-55% to-orange-600 font-semibold"
          : "text-[#141414]",
      )}
    >
      {word}
    </motion.span>
  );
}

function About() {
  const aboutRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  // Dynamic zoom: scale increases as user approaches the section center, and scales back as they scroll away
  const zoomScale = useTransform(
    scrollYProgress,
    [0.08, 0.48, 0.58, 0.95],
    [0.92, 1.1, 1.1, 0.92],
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.3, 0.7, 0.95],
    [0, 1, 1, 0],
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0.05, 0.5, 0.95],
    [0.85, 1.15, 0.85],
  );

  return (
    <section
      ref={aboutRef}
      id="about"
      aria-label="About Miux Studio"
      className="relative bg-[#F6F5F0] px-4 sm:px-5 py-20 sm:py-36 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <h2 className="sr-only">About Miux Studio</h2>
        {/* Ambient warm orange glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 overflow-visible">
          <motion.div
            style={{ opacity: glowOpacity, scale: glowScale }}
            aria-hidden="true"
            className="pointer-events-none"
          >
            <div className="h-[320px] w-[320px] sm:h-[500px] sm:w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.16)_0%,rgba(249,115,22,0.04)_50%,transparent_70%)] blur-[90px]" />
          </motion.div>
        </div>

        {/* Zooming statement with word-by-word scroll unblur */}
        <motion.div
          style={{ scale: zoomScale }}
          className="mx-auto max-w-4xl text-center text-2xl leading-[1.32] font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[62px] lg:leading-[1.18] text-[#141414]"
        >
          {ABOUT_STATEMENT_WORDS.map((word, i) => (
            <ScrollWord
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={ABOUT_STATEMENT_WORDS.length}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  3.5 SERVICES (id="services")                                         */
/* ───────────────────────────────────────────────────────────────────── */

const STUDIO_SERVICES = [
  {
    number: "01",
    title: "Brand Design & Identity",
    description:
      "Comprehensive logo systems, typographic palettes, brand guidelines, and visual language that command market presence.",
  },
  {
    number: "02",
    title: "Web Design & UI/UX",
    description:
      "Conversion-focused product interfaces, wireframes, and design systems crafted for high user retention and seamless journeys.",
  },
  {
    number: "03",
    title: "Web Development",
    description:
      "Ultra-fast Next.js architecture, interactive WebGL shaders, responsive styling, and robust API integrations.",
  },
  {
    number: "04",
    title: "AI Automation & Systems",
    description:
      "Intelligent workflows, API integrations, and automation pipelines designed to eliminate friction and scale output.",
  },
  {
    number: "05",
    title: "Ads & Campaign Strategy",
    description:
      "High-impact digital ad creative, promotional microsites, and performance assets that convert visitors into revenue.",
  },
];

function ServicesSection() {
  return (
    <section
      id="services"
      aria-label="Studio Services and Capabilities"
      className="relative bg-[#F6F5F0] px-4 pb-16 pt-16 sm:px-5 sm:pb-24 sm:pt-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        <div className="mb-10 flex flex-col items-start gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-display text-sm italic text-orange-600">
              Capabilities
            </span>
            <BlurRevealTitle
              as="h2"
              className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-5xl md:text-6xl"
            >
              Our Services
            </BlurRevealTitle>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#5C5A55] sm:text-base">
            Full-spectrum brand identity, web design, and digital engineering
            tailored for ambitious teams.
          </p>
        </div>

        <ol className="border-t border-[#141414]/[0.10]">
          {STUDIO_SERVICES.map((service, index) => (
            <li
              key={service.number}
              className="group relative border-b border-[#141414]/[0.10]"
            >
              <Link
                href="/work"
                className="relative flex items-start gap-4 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 sm:items-center sm:gap-8 sm:py-9"
              >
                <span className="font-display text-2xl text-[#141414]/25 transition-colors duration-300 group-hover:text-orange-600 group-focus-within:text-orange-600 sm:text-4xl">
                  {service.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-semibold tracking-tight text-[#141414] transition-colors duration-300 group-hover:text-orange-600 sm:text-3xl md:text-4xl">
                    {service.title}
                  </span>
                  <span className="mt-2 block max-w-xl text-sm leading-relaxed text-[#5C5A55]">
                    {service.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative hidden h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-[#141414]/[0.10] opacity-0 transition-all duration-500 group-focus-within:opacity-100 group-hover:opacity-100 lg:block"
                >
                  <Image
                    src={(projects[index] ?? projects[0]).image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#141414]/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-600"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  4. WORK (id="work") — Continuous scroll flow                         */
/* ───────────────────────────────────────────────────────────────────── */

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ y: 36 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-t border-[#141414]/[0.10] py-10 first:border-t-0 sm:py-14"
    >
      <Link
        href={`/work/${project.slug}`}
        aria-label={`View case study: ${project.title}`}
        className="grid items-center gap-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 sm:gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-0 bg-[#ECEAE3] shadow-none">
          <Image
            src={project.image}
            alt={`${project.title} — ${project.category} project by Miux Studio`}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 z-20 rounded-full border border-white/[0.2] bg-black/50 px-3 py-1 font-display text-sm tabular-nums text-white backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-orange-600">
            {project.category}
          </span>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#141414] sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5C5A55] sm:text-base">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#141414]/[0.10] bg-white/75 px-3 py-1 text-[11px] text-[#5C5A55]"
              >
                {service}
              </span>
            ))}
          </div>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#141414]">
            View case study
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/* One card in the stacked deck: pins in place, the next card slides over it. */
function StickyProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <div
      className="sticky"
      style={{ top: `calc(5.5rem + ${index * 14}px)`, zIndex: index + 1 }}
    >
      <div className="pb-[11vh]">
        <motion.article
          initial={{ opacity: 0.55, y: 56, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative h-[66svh] min-h-[440px] max-h-[560px] overflow-hidden rounded-[28px] border-0 bg-[#181818] shadow-none sm:h-[64vh] sm:min-h-[520px] sm:max-h-[660px]"
        >
          <Image
            src={project.image}
            alt={`${project.title} — ${project.category} project by Miux Studio`}
            fill
            loading="lazy"
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/25 to-transparent"
          />
          <ProgressiveBlur
            direction="bottom"
            blurLayers={8}
            blurIntensity={0.5}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-[28px]"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-5 sm:p-7">
            <span className="rounded-full border border-white/[0.18] bg-black/45 px-3 py-1 font-display text-sm tabular-nums text-white backdrop-blur-md">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-orange-300/25 bg-orange-950/35 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-orange-200 backdrop-blur-md sm:text-[11px]">
              {project.category}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 md:p-10">
            <div className="max-w-2xl">
              <h3 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                {project.title}
              </h3>
              <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-[#C7C7C7] sm:mt-4 sm:line-clamp-3 sm:text-base">
                {project.description}
              </p>
              <div className="mt-4 hidden flex-wrap gap-2 sm:mt-5 sm:flex">
                {project.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/[0.14] bg-black/30 px-3 py-1 text-[11px] text-[#D4D4D4] backdrop-blur-md"
                  >
                    {service}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.2] bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-md sm:mt-6 sm:text-sm">
                View case study
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>

          <Link
            href={`/work/${project.slug}`}
            aria-label={`View case study: ${project.title}`}
            className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            <span className="sr-only">{project.title}</span>
          </Link>
        </motion.article>
      </div>
    </div>
  );
}

function Work() {
  const displayedProjects = projects.slice(0, 4);
  const workRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: workRef,
    offset: ["start end", "end start"],
  });
  const halfMoonOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.24, 0.78, 0.98],
    [0, 1, 0.95, 0],
  );
  const halfMoonBlurOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.78, 0.96],
    [0, 0.85, 1],
  );

  return (
    <section
      ref={workRef}
      id="work"
      aria-label="Selected work"
      className="relative bg-[#F6F5F0] px-5 pb-4 pt-14 sm:pt-16"
    >
      {/* Sticky half-moon orange shadow in the background behind the Work projects,
          smoothly transitioning into progressive blur as you scroll further down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-x-clip"
      >
        <div className="sticky top-[18vh] flex h-[72vh] w-full flex-col items-center justify-end">
          <motion.div
            style={{ opacity: halfMoonOpacity }}
            className="relative h-40 w-[94%] max-w-[1160px] will-change-[opacity] sm:h-52"
          >
            {/* Half-moon orange shadow dome */}
            <div className="absolute inset-x-0 bottom-0 h-full rounded-t-[100%] bg-[radial-gradient(ellipse_78%_92%_at_50%_100%,rgba(234,68,24,0.34)_0%,rgba(249,115,22,0.22)_42%,rgba(251,146,60,0.08)_72%,transparent_100%)] blur-2xl" />
            <div className="absolute inset-x-10 bottom-0 h-28 rounded-t-[100%] bg-[radial-gradient(ellipse_62%_85%_at_50%_100%,rgba(220,38,38,0.20)_0%,rgba(249,115,22,0.14)_50%,transparent_100%)] blur-xl sm:inset-x-24 sm:h-36" />
          </motion.div>

          {/* Smooth progressive blur activating as you scroll longer through Work */}
          <motion.div
            style={{ opacity: halfMoonBlurOpacity }}
            className="absolute inset-x-0 bottom-0 h-32 w-full will-change-[opacity] sm:h-40"
          >
            <ProgressiveBlur
              direction="bottom"
              blurLayers={6}
              blurIntensity={0.65}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F6F5F0]/50 to-[#F6F5F0]" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-10 flex w-full max-w-[1180px] flex-col items-start gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-display text-sm italic text-orange-600">
            01 — Selected
          </span>
          <BlurRevealTitle
            as="h2"
            className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-5xl md:text-6xl"
          >
            Our Work
          </BlurRevealTitle>
        </div>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#5C5A55] transition-colors hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
        >
          All case studies
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {prefersReducedMotion ? (
        <div className="relative z-10 mx-auto w-full max-w-[1100px]">
          {displayedProjects.map((project, idx) => (
            <ProjectRow key={project.id} project={project} index={idx} />
          ))}
          <div aria-hidden="true" className="relative h-24 w-full pointer-events-none select-none overflow-visible">
            <div className="absolute inset-x-4 -top-4 h-20 rounded-[100%] bg-[radial-gradient(ellipse_68%_72%_at_50%_18%,rgba(234,68,24,0.34)_0%,rgba(249,115,22,0.20)_40%,transparent_100%)] blur-2xl" />
            <ProgressiveBlur
              direction="bottom"
              blurLayers={8}
              blurIntensity={0.6}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F6F5F0]/45 to-[#F6F5F0]" />
          </div>
        </div>
      ) : (
        <div className="relative z-10 mx-auto w-full max-w-[1180px]">
          {displayedProjects.map((project, idx) => (
            <StickyProjectCard
              key={project.id}
              project={project}
              index={idx}
              total={displayedProjects.length}
            />
          ))}
          <div aria-hidden="true" className="relative -mt-[11vh] h-28 sm:h-36 w-full pointer-events-none select-none overflow-visible">
            {/* Layered orange mesh glow at the end of the project stack, styled like a soft ambient drop shadow */}
            <div className="absolute inset-x-4 sm:inset-x-10 -top-6 h-24 sm:h-32 rounded-[100%] bg-[radial-gradient(ellipse_68%_72%_at_50%_18%,rgba(234,68,24,0.38)_0%,rgba(249,115,22,0.24)_38%,rgba(251,146,60,0.10)_68%,transparent_100%)] blur-2xl" />
            <div className="absolute inset-x-12 sm:inset-x-28 -top-3 h-16 sm:h-24 rounded-[100%] bg-[radial-gradient(ellipse_60%_70%_at_35%_25%,rgba(220,38,38,0.24)_0%,transparent_70%),radial-gradient(ellipse_60%_70%_at_68%_25%,rgba(251,146,60,0.28)_0%,transparent_70%)] blur-xl" />
            {/* Smooth progressive blur dissolving cleanly into #F6F5F0 */}
            <ProgressiveBlur
              direction="bottom"
              blurLayers={8}
              blurIntensity={0.6}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F6F5F0]/45 to-[#F6F5F0]" />
          </div>
          <div aria-hidden="true" className="h-[6vh]" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-[1180px] justify-center pt-8 pb-12 sm:pt-10">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2.5 rounded-full border border-[#141414]/[0.14] bg-white/80 px-7 py-3.5 text-sm font-semibold text-[#141414] backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
        >
          <span>View All Projects ({projects.length})</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-orange-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  4.2 APPROACH (id="approach")                                         */
/* ───────────────────────────────────────────────────────────────────── */

const APPROACH_STEPS = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description:
      "We dissect your business model, customer psychology, and competitive landscape to define a clear roadmap with measurable deliverables.",
  },
  {
    step: "02",
    title: "Iterative Design Sprints",
    description:
      "Rapid visual explorations, wireframing, and interactive prototypes with transparent progress updates and continuous stakeholder alignment.",
  },
  {
    step: "03",
    title: "Modern Engineering",
    description:
      "Pixel-perfect implementation built on Next.js, Tailwind CSS, and WebGL with rigorous attention to speed, SEO, and accessible interaction.",
  },
  {
    step: "04",
    title: "Launch & Growth Tuning",
    description:
      "Seamless deployment, analytics tracking, and ongoing sprint support ensuring conversion velocity from day one.",
  },
];

function ApproachSection() {
  return (
    <section
      id="approach"
      aria-label="Studio Approach and Methodology"
      className="relative bg-[#F6F5F0] px-4 py-16 sm:px-5 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="font-display text-sm italic text-orange-600">
            Method
          </span>
          <BlurRevealTitle
            as="h2"
            className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-5xl md:text-6xl"
          >
            Approach
          </BlurRevealTitle>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#5C5A55] sm:text-base">
            A disciplined, sprint-based workflow focused on craft, speed, and
            tangible business metrics.
          </p>
          <Link
            href="/meeting"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#141414] transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            Walk through it in 45 minutes
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ol className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-y-2 left-[7px] w-px bg-gradient-to-b from-orange-500/70 via-[#141414]/[0.14] to-transparent"
          />
          {APPROACH_STEPS.map((item) => (
            <li key={item.step} className="relative pb-10 pl-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 flex size-3.5 items-center justify-center rounded-full border border-orange-500/60 bg-[#F6F5F0]"
              >
                <span className="size-1.5 rounded-full bg-orange-600" />
              </span>
              <span className="font-display text-sm text-orange-600">
                {item.step}
              </span>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5C5A55] sm:text-base">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  4.5 STATS (Impact Numbers with Animated Counters)                    */
/* ───────────────────────────────────────────────────────────────────── */

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2.2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const DELIVERY_SERIES = [
  { value: 8, date: "Dec 2025" },
  { value: 10, date: "Jan 2026" },
  { value: 9, date: "Feb 2026" },
  { value: 11, date: "Mar 2026" },
  { value: 12, date: "Apr 2026" },
  { value: 10, date: "May 2026" },
  { value: 13, date: "Jun 2026" },
  { value: 14, date: "Jul 2026" },
  { value: 12, date: "Aug 2026" },
  { value: 15, date: "Sep 2026" },
  { value: 17, date: "Oct 2026" },
  { value: 19, date: "Nov 2026" },
];

const DELIVERY_PERIODS = [
  { label: "12 mo" },
  { label: "6 mo", points: 6 },
  { label: "3 mo", points: 3 },
];

function Stats() {
  return (
    <section
      aria-label="Studio impact numbers"
      className="relative bg-[#F6F5F0] py-16 sm:py-24 px-4 sm:px-5 overflow-hidden"
    >
      {/* Warm Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,rgba(234,88,12,0.03)_45%,transparent_70%)] blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="h-full md:col-span-2 lg:col-span-1"
          >
            <ProgressMetricCard
              title="Projects delivered"
              total={STATS.projects}
              suffix="+"
              delta="+18"
              deltaLabel="vs last year"
              percent="+18%"
              trend="up"
              accent="orange"
              unit="projects"
              period="12 mo"
              periodOptions={DELIVERY_PERIODS}
              data={DELIVERY_SERIES}
              description="For ambitious APAC teams."
              defaultView="curve"
              size="sm"
              showStats={false}
              className="h-full"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.08 }}
            className="h-full"
          >
            <div className="group relative flex h-full min-h-[272px] flex-col overflow-hidden rounded-[28px] border border-[#141414]/[0.10] bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(20,20,20,0.12)] backdrop-blur-xl transition-colors duration-300 hover:border-orange-500/40 hover:bg-white sm:min-h-[310px] sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14),transparent_70%)] blur-2xl"
              />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C5A55]">
                Industries served
              </p>
              <div className="relative mt-auto">
                <h3 className="text-5xl font-medium leading-none tracking-[-0.05em] sm:text-6xl">
                  <span className="bg-gradient-to-br from-[#141414] via-[#141414] to-orange-600 bg-clip-text text-transparent">
                    <AnimatedCounter value={STATS.industries} suffix="+" />
                  </span>
                </h3>
                <p className="mt-3 max-w-[15rem] text-sm leading-snug text-[#5C5A55]">
                  Across web, apps, and AI media.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.16 }}
            className="h-full"
          >
            <div className="group relative flex h-full min-h-[272px] flex-col overflow-hidden rounded-[28px] border border-[#141414]/[0.10] bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(20,20,20,0.12)] backdrop-blur-xl transition-colors duration-300 hover:border-orange-500/40 hover:bg-white sm:min-h-[310px] sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14),transparent_70%)] blur-2xl"
              />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C5A55]">
                In-house delivery
              </p>
              <div className="relative mt-auto">
                <h3 className="text-5xl font-medium leading-none tracking-[-0.05em] sm:text-6xl">
                  <span className="bg-gradient-to-br from-[#141414] via-[#141414] to-orange-600 bg-clip-text text-transparent">
                    <AnimatedCounter value={STATS.inHousePercent} suffix="%" />
                  </span>
                </h3>
                <p className="mt-3 max-w-[15rem] text-sm leading-snug text-[#5C5A55]">
                  Designed and built by our own team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  5. PRICING (Imported from @/components/ui/pricing)                   */
/* ───────────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────────── */
/*  6. TESTIMONIALS (Imported from @/components/ui/testimonial)          */
/* ───────────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────────── */
/*  7. FAQ (Imported from @/components/ui/faqs-component)                */
/* ───────────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────────── */
/*  8. FINAL CTA                                                         */
/* ───────────────────────────────────────────────────────────────────── */

const CTA_CORNER_FOG = [
  "pointer-events-none absolute -bottom-20 -left-20 h-[480px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22)_0%,rgba(234,88,12,0.09)_45%,transparent_72%)] blur-[90px]",
  "pointer-events-none absolute -bottom-16 -right-20 h-[500px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.20)_0%,rgba(249,115,22,0.08)_46%,transparent_74%)] blur-[100px]",
];

function FinalCTA() {
  const [youOpen, setYouOpen] = useState(false);

  return (
    <section
      id="final-cta"
      aria-label="Call to action"
      className="relative bg-[#F6F5F0] px-5 py-28 text-center sm:py-36 overflow-hidden"
    >
      {/* Animated volumetric hill field, feathered into the site background */}
      <GLSLHills
        className="absolute inset-0 opacity-85 [mask-image:linear-gradient(to_top,transparent_0%,black_14%,black_72%,rgba(0,0,0,0.35)_90%,transparent_100%)]"
        cameraZ={125}
        planeSize={256}
        speed={0.5}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_68%)]"
      />

      {/* Slow, shining ambient pulsing glow */}
      <motion.div
        animate={{
          scale: [1, 1.16, 1],
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.20)_0%,rgba(251,146,60,0.09)_40%,transparent_70%)] blur-[90px]"
        aria-hidden="true"
      />

      {/* Soft orange fog drifting in the bottom-left and bottom-right corners */}
      {CTA_CORNER_FOG.map((className, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          animate={{
            opacity: [0.55, 0.85, 0.55],
            scale: [1, 1.08, 1],
            x: index === 0 ? [0, 18, 0] : [0, -18, 0],
          }}
          transition={{
            duration: 11 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={className}
        />
      ))}

      {/* Seamless edge blend: the CTA shares the page off-white background with no visible band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#F6F5F0] via-[#F6F5F0]/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F6F5F0] via-[#F6F5F0]/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F6F5F0] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F6F5F0] to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        <div className="overflow-hidden">
          <BlurRevealTitle className="text-4xl font-semibold tracking-[-0.07em] text-[#141414] sm:text-6xl md:text-7xl text-center">
            Let’s Talk About
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141414] via-[#4A2511] to-orange-600">
              Your Project
            </span>
          </BlurRevealTitle>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-7 max-w-xl text-base text-[#5C5A55] sm:text-lg text-center space-y-1.5"
        >
          <p>A focused 45-minute call to see if we&apos;re a good fit.</p>
          <p className="text-[#141414] font-medium">
            No pressure. Just clarity.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10"
        >
          <Link
            href="/meeting"
            aria-label="Book a 45-minute discovery call with Miux Studio"
            title="Book a 45-min call with Miux Studio"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setYouOpen(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setYouOpen(false);
            }}
            onFocus={() => {
              if (window.matchMedia("(hover: hover)").matches) setYouOpen(true);
            }}
            onBlur={() => setYouOpen(false)}
            className="group relative inline-flex items-center gap-3.5 rounded-full bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#fed7aa_35%,#f97316_70%,#ea580c_100%)] px-7 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-[#141414] shadow-[0_2px_14px_rgba(234,88,12,0.22)] ring-1 ring-inset ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_26px_rgba(234,88,12,0.35)] select-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            <span className="flex shrink-0 items-center">
              <span
                className="relative flex size-8 shrink-0 items-center justify-center sm:size-9"
                onClick={(event) => {
                  if (window.matchMedia("(hover: none)").matches) {
                    event.preventDefault();
                    event.stopPropagation();
                    setYouOpen((open) => !open);
                  }
                }}
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="relative z-10 size-full rounded-full bg-[#141414] object-contain p-1.5"
                />
              </span>
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={youOpen ? "open" : "closed"}
                variants={{
                  closed: { width: 0, opacity: 0 },
                  open: { width: "auto", opacity: 1 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.7,
                }}
                className="flex h-8 items-center overflow-hidden sm:h-9"
              >
                <span className="flex shrink-0 items-center">
                  <span className="mx-1.5 inline-flex items-center justify-center text-sm font-bold leading-none text-[#141414] sm:mx-2 sm:text-base">
                    +
                  </span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white text-[9px] font-bold uppercase leading-none tracking-[0.04em] text-[#141414] shadow-[0_6px_20px_rgba(0,0,0,0.28)] sm:size-9 sm:text-[10px]">
                    YOU
                  </span>
                </span>
              </motion.span>
            </span>

            <span>Book a 45-min call</span>
            <ArrowUpRight aria-hidden="true" className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  MAIN PAGE EXPORT                                                     */
/* ───────────────────────────────────────────────────────────────────── */

function StickyHalfMoonBlur() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Only activate after scrolling past the hero section so blur never hides the hero section
      setVisible(window.scrollY > 520);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[850px] h-14 sm:h-20 overflow-hidden select-none transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="w-full h-[200%] rounded-t-[100%] backdrop-blur-xl [mask-image:radial-gradient(ellipse_100%_100%_at_bottom,black_35%,transparent_96%)]" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />
      <main>
        <Hero />
        <CompanyCardMarquee />
        <About />
        <ServicesSection />
        <Work />
        <ApproachSection />
        <Stats />
        <Pricing />
        <Testimonials />
        <FAQs items={faqs} />
        <FinalCTA />
      </main>
      <Footer />

      {/* Sticky half-moon shape rounded blur: hidden on Hero section, active while scrolling below */}
      <StickyHalfMoonBlur />
    </div>
  );
}
