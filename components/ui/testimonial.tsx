"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Globe } from "lucide-react";
import { BlurRevealTitle } from "@/components/ui/blur-reveal-title";
import Image from "next/image";
import { testimonials as TESTIMONIALS_DATA, type TestimonialItem } from "@/lib/testimonials";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Testimonial3DCard({ item }: { item: TestimonialItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTiltActive, setIsTiltActive] = useState(false);
  const canTiltRef = useRef(true);

  useEffect(() => {
    canTiltRef.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!canTiltRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / rect.width) * 100;
    const yPct = (mouseY / rect.height) * 100;

    // Smooth, organic 3D tilt
    const rX = (mouseY / rect.height - 0.5) * -18;
    const rY = (mouseX / rect.width - 0.5) * 18;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: xPct, y: yPct });
  };

  const handleMouseEnter = () => {
    if (!canTiltRef.current) return;
    setIsHovered(true);
    // Small delay (140ms) before the 3D tilt effect starts
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsTiltActive(true);
    }, 140);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
    setIsTiltActive(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full select-none">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isTiltActive
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025) translateZ(14px)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)",
          transition: isTiltActive
            ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          transformStyle: "preserve-3d",
        }}
        className="group relative overflow-hidden rounded-2xl p-7 bg-white/85 text-[#141414] border border-[#141414]/[0.10] shadow-[0_12px_36px_-18px_rgba(20,20,20,0.09)] hover:border-orange-500/70 flex flex-col justify-between min-h-[270px]"
      >
        {/* Subtle background grid mesh on rest state */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14141409_1px,transparent_1px),linear-gradient(to_bottom,#14141409_1px,transparent_1px)] bg-[size:48px_52px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />

        {/* Slow, smooth Orange Hover Fill Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 z-0"
        />

        {/* 3D Specular Shine & Glare Overlay following mouse on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700 z-20"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 140, 40, 0.12) 40%, transparent 75%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Extra holographic light sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700 z-20"
          style={{
            opacity: isHovered ? 0.65 : 0,
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.2), transparent 70%)`,
          }}
        />

        {/* Card Body Content with 3D Depth */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className="relative z-10 flex flex-col justify-between h-full space-y-6"
        >
          {/* Quote */}
          <p className="leading-relaxed font-normal text-base sm:text-lg text-[#2E2D2A] transition-colors duration-700 group-hover:text-white">
            &ldquo;{item.quote}&rdquo;
          </p>

          {/* Author details */}
          <div className="flex justify-between items-center pt-5 border-t border-[#141414]/[0.08] transition-colors duration-700 group-hover:border-white/25">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-[#141414] transition-colors duration-700 group-hover:text-white">
                  {item.name}
                </h3>
                <a
                  href={item.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${item.name}'s profile (${item.handle})`}
                  title={`Visit ${item.handle}`}
                  className="text-xs font-medium text-orange-600 transition-colors duration-700 group-hover:text-white/95 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>{item.handle}</span>
                  <ArrowUpRight className="size-3 opacity-70" />
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78756E] transition-colors duration-700 group-hover:text-white/80">
                  {item.role} of
                </span>
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.company} website`}
                  title={`Open ${item.company} website`}
                  className="text-xs font-medium text-[#2E2D2A] transition-colors duration-700 group-hover:text-white underline decoration-dotted underline-offset-2 inline-flex items-center gap-1"
                >
                  <span>{item.company}</span>
                  <Globe className="size-2.5 opacity-60" />
                </a>
              </div>
            </div>

            {item.avatar ? (
              <Image
                src={item.avatar.src}
                alt={item.avatar.alt}
                width={36}
                height={36}
                loading="lazy"
                className="size-9 shrink-0 rounded-full border border-orange-500/30 object-cover transition-colors duration-700 group-hover:border-white/50"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#141414]/[0.14] bg-[#ECEAE3] text-xs font-semibold text-[#141414] transition-colors duration-700 group-hover:border-white/50 group-hover:bg-white/15 group-hover:text-white"
              >
                {initials(item.name)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientFeedback({ className }: { className?: string }) {
  const col1 = [TESTIMONIALS_DATA[0], TESTIMONIALS_DATA[1]];
  const col2 = [TESTIMONIALS_DATA[2], TESTIMONIALS_DATA[3]];
  const col3 = [TESTIMONIALS_DATA[4], TESTIMONIALS_DATA[5]];

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className={cn("relative w-full bg-[#F6F5F0] text-[#141414] py-24 sm:py-32 px-5 overflow-hidden", className)}
    >
      {/* Warm Vibrant Orange Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,rgba(234,88,12,0.04)_45%,transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-10 -right-20 w-[500px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.09)_0%,transparent_65%)] blur-[90px]" />
        <div className="absolute top-10 -left-20 w-[500px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.08)_0%,transparent_65%)] blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 h-full max-w-7xl mx-auto rounded-2xl"
      >
        <article className="max-w-screen-md mx-auto text-center space-y-3 mb-16">
          <BlurRevealTitle as="h2" className="xl:text-5xl md:text-4xl text-3xl font-semibold tracking-[-0.05em] leading-tight text-[#141414]">
            <span className="inline-block bg-gradient-to-r from-[#141414] via-[#4A2511] to-orange-600 bg-clip-text text-transparent font-semibold">
              Trusted by founders and product teams across APAC and the UAE.
            </span>
          </BlurRevealTitle>
          <p className="mx-auto text-base text-[#5C5A55] max-w-xl leading-relaxed">
            How visionary leaders across Asia and the UAE accelerate their growth with Miux Studio.
          </p>
        </article>

        {/* Vertical Columns with 3D Holographic Card Shine */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {col1.map((item) => (
              <Testimonial3DCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {col2.map((item) => (
              <Testimonial3DCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6 lg:gap-8 md:col-span-2 lg:col-span-1">
            {col3.map((item) => (
              <Testimonial3DCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ClientFeedback;
export { ClientFeedback, ClientFeedback as Testimonials };
