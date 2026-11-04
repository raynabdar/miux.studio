"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";

interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  handle: string;
  role: string;
  company: string;
  website: string;
  profileUrl: string;
  avatar: string;
  variant?: "dark" | "orange";
  flexRatio?: number;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "1",
    quote: "Miux Studio has been a game-changer for our brand. Their design systems and engineering velocity are unmatched.",
    name: "Guillermo Rauch",
    handle: "@rauchg",
    role: "CEO",
    company: "Enigma",
    website: "https://enigma.com",
    profileUrl: "https://x.com/rauchg",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    variant: "dark",
    flexRatio: 7,
  },
  {
    id: "2",
    quote: "We saw a 3x lift in conversion within four weeks of launching the new digital platform.",
    name: "Rika Shinoda",
    handle: "@rikashinoda",
    role: "CEO",
    company: "Kintsugi",
    website: "https://kintsugi.com",
    profileUrl: "https://x.com/rikashinoda",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    variant: "orange",
    flexRatio: 3,
  },
  {
    id: "3",
    quote: "Their team is highly strategic, and their clean development architecture truly streamlined our customer journey.",
    name: "Reacher",
    handle: "@reacher",
    role: "CEO",
    company: "OdeaoLabs",
    website: "https://odeaolabs.com",
    profileUrl: "https://x.com/reacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    variant: "dark",
  },
  {
    id: "4",
    quote: "Working with Miux Studio was effortless. Senior-level partners, zero fluff, and delivery that exceeded our expectations.",
    name: "John",
    handle: "@john",
    role: "CEO",
    company: "Labsbo",
    website: "https://labsbo.com",
    profileUrl: "https://x.com/john",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    variant: "dark",
  },
  {
    id: "5",
    quote: "Their creative direction elevated our positioning across the UAE. We could not have asked for a better partner.",
    name: "Steven Sunny",
    handle: "@stevensunny",
    role: "CEO",
    company: "Boxefi",
    website: "https://boxefi.com",
    profileUrl: "https://x.com/stevensunny",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    variant: "dark",
  },
  {
    id: "6",
    quote: "Miux Studio has been a pivotal growth driver for our enterprise web products.",
    name: "Guillermo Rauch",
    handle: "@rauchg",
    role: "CEO",
    company: "OdeaoLabs",
    website: "https://odeaolabs.com",
    profileUrl: "https://x.com/rauchg",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
    variant: "orange",
    flexRatio: 3,
  },
  {
    id: "7",
    quote: "Miux Studio has been a true partner. Their deep craftsmanship, high standards, and relentless commitment to measurable results set them completely apart.",
    name: "Paul Brauch",
    handle: "@paulbrauch",
    role: "CTO",
    company: "Spectrum",
    website: "https://spectrum.chat",
    profileUrl: "https://x.com/paulbrauch",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    variant: "dark",
    flexRatio: 7,
  },
];

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const isOrange = item.variant === "orange";

  return (
    <div
      className={cn(
        "group flex flex-col justify-between relative overflow-hidden rounded-2xl p-7 transition-all duration-300",
        isOrange
          ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border border-orange-400/50 md:hover:border-orange-300 md:hover:-translate-y-1.5 md:hover:shadow-[0_0_35px_-5px_rgba(249,115,22,0.45)]"
          : "bg-[#181512] text-white border border-orange-500/20 md:hover:border-orange-500/60 md:hover:-translate-y-1.5 md:hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.25)]"
      )}
      style={{
        flex: item.flexRatio ? `${item.flexRatio}` : undefined,
      }}
    >
      {/* Subtle grid mesh on dark cards with warm orange sheen */}
      {!isOrange && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f973160a_1px,transparent_1px),linear-gradient(to_bottom,#f973160a_1px,transparent_1px)] bg-[size:48px_52px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      )}

      {/* Quote */}
      <article className="mt-auto relative z-10">
        <p
          className={cn(
            "leading-relaxed font-normal",
            isOrange
              ? "text-base text-white/95"
              : "text-base sm:text-lg text-neutral-200"
          )}
        >
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* Author details with workable links */}
        <div
          className={cn(
            "flex justify-between items-center pt-6 mt-5 border-t transition-colors",
            isOrange
              ? "border-white/25"
              : "border-white/[0.08] group-hover:border-orange-500/30"
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold lg:text-lg text-base text-white">
                {item.name}
              </h3>
              {/* Clickable @username handle link */}
              <a
                href={item.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${item.name}'s profile (${item.handle})`}
                title={`Visit ${item.handle}`}
                className={cn(
                  "text-xs font-medium transition-colors hover:underline inline-flex items-center gap-0.5",
                  isOrange
                    ? "text-white/90 hover:text-white"
                    : "text-orange-400 hover:text-orange-300"
                )}
              >
                <span>{item.handle}</span>
                <ArrowUpRight className="size-3 opacity-70" />
              </a>
            </div>

            {/* Clickable Company Website Link */}
            <div className="flex items-center gap-1.5">
              <span className={isOrange ? "text-xs text-white/80" : "text-xs text-[#8A8A8A]"}>
                {item.role} of
              </span>
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${item.company} website`}
                title={`Open ${item.company} website`}
                className={cn(
                  "text-xs font-medium transition-colors underline decoration-dotted underline-offset-2 inline-flex items-center gap-1",
                  isOrange
                    ? "text-white hover:text-white"
                    : "text-[#D4D4D4] hover:text-orange-400"
                )}
              >
                <span>{item.company}</span>
                <Globe className="size-2.5 opacity-60" />
              </a>
            </div>
          </div>

          <a
            href={item.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${item.name} avatar`}
            className="shrink-0"
          >
            <Image
              src={item.avatar}
              alt={item.name}
              width={200}
              height={200}
              loading="lazy"
              className={cn(
                "w-12 h-12 rounded-full object-cover transition-colors",
                isOrange
                  ? "border border-white/40"
                  : "border border-orange-500/30 md:group-hover:border-orange-400"
              )}
            />
          </a>
        </div>
      </article>
    </div>
  );
}

function ClientFeedback({ className }: { className?: string }) {
  const col1 = [TESTIMONIALS_DATA[0], TESTIMONIALS_DATA[1]];
  const col2 = [TESTIMONIALS_DATA[2], TESTIMONIALS_DATA[3], TESTIMONIALS_DATA[4]];
  const col3 = [TESTIMONIALS_DATA[5], TESTIMONIALS_DATA[6]];

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className={cn("relative w-full bg-[#141414] text-white py-24 sm:py-32 px-5 overflow-hidden", className)}
    >
      {/* Warm Vibrant Orange Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18)_0%,rgba(234,88,12,0.06)_45%,transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-10 -right-20 w-[500px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_65%)] blur-[90px]" />
        <div className="absolute top-10 -left-20 w-[500px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.10)_0%,transparent_65%)] blur-[90px]" />
      </div>

      {/* The entire section renders as a single unified block with smooth blur lazy load */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 h-full max-w-7xl mx-auto rounded-2xl"
      >
        <article className="max-w-screen-md mx-auto text-center space-y-3 mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-medium inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
            04 / Endorsements
          </p>
          <h2 className="xl:text-5xl md:text-4xl text-3xl font-semibold tracking-[-0.05em] leading-tight text-white">
            <span className="inline-block bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent font-semibold">
              Trusted by Startups and the world&apos;s largest companies.
            </span>
          </h2>
          <p className="mx-auto text-base text-[#B3B3B3] max-w-xl leading-relaxed">
            How visionary leaders across Asia and the UAE accelerate their growth with Miux Studio.
          </p>
        </article>

        {/* Responsive grid: all cards render together at once as a single block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full pt-4 pb-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full">
            {col1.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full">
            {col2.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full md:col-span-2 lg:col-span-1">
            {col3.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Decorative framed line with warm glow accents */}
        <div className="relative border-b border-orange-500/20 mt-6 h-8 z-[2] w-full">
          <div className="w-full h-full relative before:absolute before:-left-1 before:-bottom-1 before:w-2 before:h-2 before:bg-[#202020] before:border before:border-orange-500/40 after:absolute after:-right-1 after:-bottom-1 after:w-2 after:h-2 after:bg-[#202020] after:border after:border-orange-500/40" />
        </div>
      </motion.div>
    </section>
  );
}

export default ClientFeedback;
export { ClientFeedback, ClientFeedback as Testimonials };
