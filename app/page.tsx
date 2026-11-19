"use client";

import { Footer, Navbar } from "@/components/site-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FAQs from "@/components/ui/faqs-component";
import Pricing from "@/components/ui/pricing";
import { ShinyButton } from "@/components/ui/shiny-button";
import Testimonials from "@/components/ui/testimonial";
import { ClutchWidget } from "@/components/ui/clutch-widget";
import { BlurRevealTitle } from "@/components/ui/blur-reveal-title";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { CompanyCardMarquee } from "@/components/LogoMarquee";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Animation variants ─────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* ───────────────────────────────────────────────────────────────────── */
/*  2. HERO (id="home")                                                  */
/* ───────────────────────────────────────────────────────────────────── */

const founderAvatars = [
  {
    name: "Alex Rivera",
    role: "Founder, Zenith",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
  },
  {
    name: "Sarah Chen",
    role: "CEO, Vertex AI",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces",
  },
  {
    name: "Marcus Brody",
    role: "CTO, Prism Labs",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  },
  {
    name: "Elena Rostova",
    role: "Co-Founder, HyperScale",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces",
  },
  {
    name: "David Kim",
    role: "Product Lead, Kintsugi",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
  },
];

function Hero() {
  // Dynamic month: changes dynamically after month ends (e.g. 'November')
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  return (
    <section
      id="home"
      aria-label="Websites for Brands and Digital Businesses"
      className="relative flex min-h-[85vh] lg:min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#141414] px-4 sm:px-5 pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* Crisp Background Image + Warm Mesh Ambient Lighting (No blur on hero image or text) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden bg-[#141414]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-image.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
        </div>

        {/* Layered Orange Mesh Gradient Orbs for vibrant depth */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.2)_0%,rgba(234,88,12,0.08)_45%,transparent_70%)]" />
        <div className="absolute top-[20%] left-[8%] w-[500px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.12)_0%,transparent_65%)]" />
        <div className="absolute top-[24%] right-[8%] w-[520px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14)_0%,transparent_65%)]" />

        {/* Ambient Dark Gradation resolving cleanly into #141414 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#141414_84%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/65 via-transparent to-[#141414]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <div className="flex w-full flex-col items-center text-center">
          {/* Founder Avatars Pill placed on TOP of Websites for Brands & Digital Businesses */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mb-6 sm:mb-8 group relative inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 rounded-full border border-white/[0.15] bg-[#181818]/85 px-3.5 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 hover:border-white/30 hover:bg-[#202020] cursor-pointer max-w-full"
          >
            {/* 5 Hoverable Overlapping Avatars */}
            <div className="flex -space-x-2 sm:-space-x-2.5 overflow-visible shrink-0">
              {founderAvatars.map((founder, i) => (
                <div
                  key={i}
                  className="group/avatar relative size-7 sm:size-9 rounded-full border-2 border-[#141414] bg-[#1A1A1A] transition-all duration-200 hover:scale-125 hover:z-30 hover:border-white/60 cursor-pointer"
                >
                  <Image
                    src={founder.image}
                    alt="Client founder avatar"
                    fill
                    sizes="36px"
                    className="rounded-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Bar Text with Outline & rating */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium text-white/90">
              <span className="font-semibold text-white tracking-tight">
                48+ startups &amp; founders
              </span>
              <span className="text-[#A3A3A3]">choose miux.studio</span>
              <span className="inline-flex items-center text-orange-400 text-[10px] sm:text-xs ml-0.5">
                ★★★★★
              </span>
            </div>
          </motion.div>

          {/* SEO-Optimized Hero Heading: Websites for Brands & Digital Businesses */}
          <div className="overflow-hidden max-w-5xl px-1">
            <motion.h1
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-[34px] leading-[1.06] font-semibold tracking-[-0.05em] sm:tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.95]"
            >
              Websites for Brands &amp; Digital Businesses
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="mt-5 sm:mt-6 max-w-2xl px-2 text-sm text-[#A3A3A3] sm:text-lg md:text-xl font-normal leading-relaxed"
          >
            Get a website or Custom business website that fulfill your goals &amp;
            drive sales.
          </motion.p>

          {/* Action Buttons */}
          <div className="mt-7 sm:mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
            <ShinyButton
              href="/meeting"
              label="Book a 45-min call"
              aria-label="Book a 45-minute discovery call with Miux Studio"
              title="Schedule a consultation call with Miux Studio"
              className="w-full max-w-[280px] sm:max-w-none sm:w-auto group"
            >
              <span className="inline-flex items-center gap-2">
                <span>Book a 45-min call</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </ShinyButton>
          </div>

          {/* Taking projects for 'November' without rounded border */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 inline-flex items-center gap-2.5 text-xs text-[#A3A3A3] select-none"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            <span>
              Taking projects for{" "}
              <strong className="font-semibold text-white">
                &apos;{currentMonth}&apos;
              </strong>
            </span>
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
  "the",
  "#1",
  "premier",
  "creative",
  "agency",
  "in",
  "Bangladesh.",
  "We",
  "help",
  "businesses",
  "to",
  "build",
  "their",
  "brand",
  "identity,",
  "we",
  "bridge",
  "the",
  "gap",
  "between",
  "premium",
  "visual",
  "design",
  "and",
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

  const opacity = useTransform(progress, [start - 0.04, start, end], [0.2, 0.45, 1]);
  const blurPx = useTransform(progress, [start - 0.04, start, end], [14, 8, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${Math.max(0, v)}px)`);
  const y = useTransform(progress, [start - 0.04, start, end], [12, 6, 0]);

  const isGradient =
    word.includes("#1") ||
    word.includes("premier") ||
    word.includes("Bangladesh") ||
    word.includes("excellence");

  return (
    <motion.span
      style={{ opacity, filter, y }}
      className={cn(
        "inline-block mr-[0.24em] transition-colors will-change-[transform,opacity,filter]",
        isGradient
          ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 via-55% to-orange-400 font-semibold"
          : "text-white",
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
      className="relative bg-[#141414] px-4 sm:px-5 py-20 sm:py-36 overflow-hidden"
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
            <div className="h-[320px] w-[320px] sm:h-[500px] sm:w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22)_0%,rgba(249,115,22,0.05)_50%,transparent_70%)] blur-[90px]" />
          </motion.div>
        </div>

        {/* Zooming statement with word-by-word scroll unblur */}
        <motion.div
          style={{ scale: zoomScale }}
          className="mx-auto max-w-4xl text-center text-2xl leading-[1.32] font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[62px] lg:leading-[1.18] text-white will-change-transform"
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
      className="relative bg-[#141414] pt-16 pb-10 sm:pt-28 sm:pb-12 px-4 sm:px-5"
    >
      <div className="relative z-10 mx-auto max-w-[1100px] w-full">
        <div className="mb-10 sm:mb-16 text-center flex flex-col items-center">
          <BlurRevealTitle className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.06em] text-white text-center">
            Our Services
          </BlurRevealTitle>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-lg text-[#A3A3A3] max-w-xl leading-relaxed text-center">
            Full-spectrum brand identity, web design, and digital engineering tailored for ambitious teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STUDIO_SERVICES.map((service) => (
            <div
              key={service.number}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]/80 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-[#1B1B1B] flex flex-col justify-between"
            >
              {/* Top specular highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              {/* Ambient hover corner sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -bottom-12 size-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="font-pixel-grid text-sm text-orange-400 tracking-widest">
                    {service.number}
                  </span>
                  <span className="size-1.5 rounded-full bg-white/15 transition-colors group-hover:bg-orange-400" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white tracking-tight group-hover:text-orange-50 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#A3A3A3] leading-relaxed">
                  {service.description}
                </p>
              </div>
              <a
                href="/contact"
                className="relative z-10 mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-[#808080] group-hover:text-white transition-colors"
              >
                <span>Explore capability</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-orange-400" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/*  4. WORK (id="work") — Vertical Scroll Card-Stacking                  */
/* ───────────────────────────────────────────────────────────────────── */

function StackedProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      className="sticky w-full transition-all duration-300"
      style={{
        top: `calc(78px + ${Math.min(index, 6) * 16}px)`,
        zIndex: index + 5,
      }}
    >
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`View case study: ${project.title}`}
        className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#161616]/95 backdrop-blur-md p-5 sm:p-8 lg:p-10 transition-all duration-500 hover:border-orange-500/40 hover:bg-[#1A1A1A] select-none"
      >
        {/* Progressive Blur Shadow beneath card (Task 5) */}
        <ProgressiveBlur
          direction="bottom"
          blurLayers={6}
          blurIntensity={0.65}
          className="absolute -bottom-6 inset-x-8 h-12 pointer-events-none -z-10 rounded-3xl"
        />

        {/* Liquid top specular highlight line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Liquid ambient corner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_70%)] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10">
          {/* Card Left / Info */}
          <div className="flex flex-col justify-between flex-1 space-y-5 sm:space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-orange-300">
                  {project.category}
                </span>
              </div>

              <h3 className="mt-3.5 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-100">
                {project.title}
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-[#A3A3A3] max-w-xl">
                {project.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.08]">
                {project.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-[#8A8A8A]"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="pt-1 sm:pt-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#141414] transition-all group-hover:bg-orange-400 group-hover:text-black">
                  <span>View Case Study</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Card Right / Media Preview with Progressive Blur */}
          <div className="relative w-full lg:w-[480px] h-[200px] sm:h-[280px] lg:h-[320px] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#1C1C1C] shrink-0">
            <Image
              src={project.image || "/placeholder.jpg"}
              alt={project.title}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Progressive blur on image */}
            <ProgressiveBlur
              direction="bottom"
              blurLayers={6}
              blurIntensity={0.45}
              className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10 rounded-b-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/75 via-transparent to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const displayedProjects = projects.slice(0, 4);

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative bg-[#141414] pt-10 pb-10 sm:pt-12 sm:pb-12 px-5"
    >
      {/* Section Header - Center Aligned */}
      <div className="relative z-10 mx-auto max-w-[1100px] w-full mb-12 sm:mb-16 text-center flex flex-col items-center">
        <BlurRevealTitle className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.06em] text-white text-center">
          Our Work
        </BlurRevealTitle>
      </div>

      {/* Vertical Stacking Cards: exactly 4 cards smoothly slide up and stack over previous cards like a deck */}
      <div className="relative z-10 mx-auto max-w-[1100px] w-full space-y-8 sm:space-y-12 pb-12">
        {displayedProjects.map((project, idx) => (
          <StackedProjectCard
            key={project.id}
            project={project}
            index={idx}
            onClick={() => setSelected(project)}
          />
        ))}
      </div>

      {/* View All Projects CTA */}
      <div className="relative z-10 mx-auto max-w-[1100px] flex justify-center pb-12">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-200"
        >
          <span>View All Projects ({projects.length})</span>
          <ArrowUpRight className="size-4 text-orange-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Project Detail Modal (shadcn Dialog) */}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="border-white/[0.12] bg-[#1A1A1A] text-white sm:max-w-xl">
          <DialogHeader>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#707070]">
              {selected?.category}
            </span>
            <DialogTitle className="text-3xl font-semibold tracking-tight text-white mt-1">
              {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#A3A3A3] mt-2">
              {selected?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/10 to-[#141414]">
            <Image
              src={selected?.image || "/placeholder.jpg"}
              alt={selected?.title || "Project preview"}
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              loading="lazy"
              className="object-cover"
            />
          </div>

          <div className="space-y-3 pt-2 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                Services Used
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {selected?.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-[#A3A3A3]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                Result Summary
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#A3A3A3]">
                {selected?.result}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href="/meeting"
              aria-label={`Inquire about a project similar to ${selected?.title || "this project"}`}
              title={`Inquire about ${selected?.title || "project"}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
            >
              <span>Visit project</span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
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
      className="relative bg-[#141414] pt-10 pb-20 sm:pt-12 sm:pb-32 px-4 sm:px-5"
    >
      <div className="relative z-10 mx-auto max-w-[1100px] w-full">
        <div className="mb-10 sm:mb-16 text-center flex flex-col items-center">
          <BlurRevealTitle className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.06em] text-white text-center">
            Approach
          </BlurRevealTitle>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-lg text-[#A3A3A3] max-w-xl leading-relaxed text-center">
            A disciplined, sprint-based workflow focused on craft, speed, and tangible business metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {APPROACH_STEPS.map((item) => (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/35 hover:bg-[#1B1B1B]"
            >
              {/* Top specular highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <div className="flex items-center justify-between">
                <span className="inline-block text-2xl font-pixel-circle text-orange-400/80 tracking-wider group-hover:text-orange-400 transition-colors">
                  {item.step}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#707070] group-hover:text-orange-300 transition-colors">
                  Phase {item.step}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white tracking-tight group-hover:text-orange-50 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[#A3A3A3] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
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

function Stats() {
  return (
    <section
      aria-label="Studio impact numbers"
      className="relative bg-[#141414] py-16 sm:py-24 px-4 sm:px-5 overflow-hidden"
    >
      {/* Warm Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,rgba(234,88,12,0.03)_45%,transparent_70%)] blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Stat 1: 150+ */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]/80 p-7 sm:p-9 text-center transition-all duration-300 hover:border-orange-500/30 hover:bg-[#1B1B1B]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent">
                <AnimatedCounter value={150} suffix="+" />
              </span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
              projects delivered for ambitious APAC teams
            </p>
          </div>

          {/* Stat 2: 40+ */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]/80 p-7 sm:p-9 text-center transition-all duration-300 hover:border-orange-500/30 hover:bg-[#1B1B1B]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent">
                <AnimatedCounter value={40} suffix="+" />
              </span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
              industries served across web, app, and AI media
            </p>
          </div>

          {/* Stat 3: 100% */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]/80 p-7 sm:p-9 text-center transition-all duration-300 hover:border-orange-500/30 hover:bg-[#1B1B1B]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent">
                <AnimatedCounter value={100} suffix="%" />
              </span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
              projects delivered by our in-house team
            </p>
          </div>
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

const CTA_PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  left: `${((i * 19) % 92) + 4}%`,
  top: `${((i * 23) % 82) + 9}%`,
  size: (i % 3) + 2,
  duration: 6.5 + (i % 6) * 1.5,
  delay: (i % 8) * 0.6,
  driftX: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6),
  driftY: -30 - (i % 4) * 10,
}));

function FinalCTA() {
  return (
    <section
      id="final-cta"
      aria-label="Call to action"
      className="relative bg-[#141414] px-5 py-28 text-center sm:py-36 overflow-hidden"
    >
      {/* Slow, shining ambient pulsing glow */}
      <motion.div
        animate={{
          scale: [1, 1.16, 1],
          opacity: [0.22, 0.38, 0.22],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.26)_0%,rgba(251,146,60,0.12)_40%,transparent_70%)] blur-[90px]"
        aria-hidden="true"
      />

      {/* Slow, smooth animated little particles */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {CTA_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px 1.5px rgba(249, 115, 22, 0.75)",
            }}
            className="absolute rounded-full bg-gradient-to-tr from-orange-400 via-amber-300 to-white"
            animate={{
              y: [0, p.driftY, 0],
              x: [0, p.driftX, 0],
              opacity: [0.15, 0.85, 0.15],
              scale: [0.75, 1.3, 0.75],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        <div className="overflow-hidden">
          <BlurRevealTitle className="text-4xl font-semibold tracking-[-0.07em] text-white sm:text-6xl md:text-7xl text-center">
            Let’s Talk About
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-orange-400">
              Your Project
            </span>
          </BlurRevealTitle>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-7 max-w-xl text-base text-[#A3A3A3] sm:text-lg text-center space-y-1.5"
        >
          <p>A focused 45-minute call to see if we&apos;re a good fit.</p>
          <p className="text-white/80 font-medium">No pressure. Just clarity.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10"
        >
          <a
            href="/meeting"
            aria-label="Book a 45-minute discovery call with Miux Studio"
            title="Book a 45-min call with Miux Studio"
            className="group relative inline-flex items-center gap-3.5 rounded-full bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#fed7aa_35%,#f97316_70%,#ea580c_100%)] px-7 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-[#141414] shadow-[0_4px_24px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(249,115,22,0.5)] select-none active:scale-[0.98]"
          >
            {/* Avatars container with hover pop effect */}
            <div className="flex items-center -space-x-1.5 overflow-visible">
              {/* Founder rounded picture */}
              <div className="relative size-8 sm:size-9 rounded-full bg-[#1A1A1A] overflow-hidden shrink-0 z-10 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={founderAvatars[0].image}
                  alt="Founder"
                  fill
                  sizes="36px"
                  className="rounded-full object-cover"
                />
              </div>

              {/* YOU rounded badge: pops out with bounce on button hover */}
              <div
                className="relative flex items-center justify-center size-8 sm:size-9 rounded-full bg-[#141414] text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase shadow-md z-20 scale-0 opacity-0 -translate-x-3 w-0 group-hover:w-8 sm:group-hover:w-9 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
              >
                YOU
              </div>
            </div>

            <span>Book a 45-min call</span>
            <ArrowUpRight className="size-4.5 sm:size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
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
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="w-full h-[200%] rounded-t-[100%] backdrop-blur-xl [mask-image:radial-gradient(ellipse_100%_100%_at_bottom,black_35%,transparent_96%)]"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
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
        <FAQs />
        <FinalCTA />
      </main>
      <Footer />

      {/* Sticky half-moon shape rounded blur: hidden on Hero section, active while scrolling below */}
      <StickyHalfMoonBlur />
    </div>
  );
}
