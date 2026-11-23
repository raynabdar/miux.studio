"use client";

import { FooterBrand } from "@/components/ui/footer-brand";
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer";
import { SITE, SOCIAL_LINKS } from "@/lib/data";
import { useCms } from "@/components/cms/cms-provider";
import { setSmoothScrollEnabled } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

/* ─── Social Icons (Custom SVG) ─────────────────────────────────────── */

function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Constants ─────────────────────────────────────────────────────── */

const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Pricing", href: "#pricing" },
] as const;

/* ─── Navbar ────────────────────────────────────────────────────────── */

export function Navbar({ heroNight = false }: { heroNight?: boolean } = {}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [overHero, setOverHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const overHeroNight = Boolean(heroNight && isHomePage && overHero);

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const getHref = useCallback(
    (hash: string) => (isHomePage ? hash : `/${hash}`),
    [isHomePage],
  );

  /* ── Auto-shrink on scroll with hysteresis & RAF ────────────────── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => {
            // Hysteresis dead-zone prevents micro-stutter near the threshold
            if (prev) {
              return y > 20;
            }
            return y > 50;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section on scroll ─────────────────────────────────────── */
  useEffect(() => {
    if (!isHomePage) return;

    let ticking = false;
    const measure = () => {
      ticking = false;
      const homeEl = document.getElementById("home");
      setOverHero(homeEl ? homeEl.getBoundingClientRect().bottom > 80 : false);

      // Offset point inside the viewport (upper focal area)
      const viewportPoint = window.scrollY + window.innerHeight * 0.38;
      const sections = [
        { id: "home", navId: "home" },
        { id: "about", navId: "about" },
        { id: "services", navId: "services" },
        { id: "work", navId: "work" },
        { id: "approach", navId: "approach" },
        { id: "pricing", navId: "pricing" },
      ] as const;

      let matched = "home";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && viewportPoint >= el.offsetTop - 120) {
          matched = s.navId;
        }
      }

      // Past the last nav section (pricing) — testimonials / FAQ / footer: nothing selected
      const pricing = document.getElementById("pricing");
      if (pricing && viewportPoint >= pricing.offsetTop - 100 + pricing.offsetHeight) {
        matched = "";
      }

      setActiveSection(matched);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHomePage]);

  /* ── Close mobile menu on outside click or Escape ─────────────────── */
  useEffect(() => {
    if (!mobileOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("click", onClickOutside, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClickOutside, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  /* ── Lock body scroll when mobile menu is open ────────────────────── */
  useEffect(() => {
    setSmoothScrollEnabled(!mobileOpen);
    return () => {
      if (mobileOpen) setSmoothScrollEnabled(true);
    };
  }, [mobileOpen]);

  /* ── Focus trap inside mobile menu ────────────────────────────────── */
  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;

    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", trap);
    first.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [mobileOpen]);

  /* ── Link click: smooth scroll & heading animation ────────────────── */
  const handleLinkClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      if (!isHomePage) return; // Allow full navigation to /#id
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Trigger heading subtle attention slide/fade if found
        const heading = el.querySelector("h2, h1");
        if (heading) {
          heading.animate(
            [
              { opacity: 0.6, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
          );
        }
      }
      setActiveSection(id);
      setMobileOpen(false);
    },
    [isHomePage],
  );

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed left-1/2 top-4 z-50 -translate-x-1/2 w-[calc(100%-2rem)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
          scrolled
            ? "max-w-[760px] translate-y-0.5"
            : "max-w-[960px] translate-y-0",
        )}
      >
        <nav
          className={cn(
            "relative overflow-hidden rounded-full border py-2.5 px-4 sm:px-6 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]",
            overHeroNight
              ? "border-[#F6F5F0]/[0.18]"
              : "border-[#141414]/[0.10]",
          )}
          style={{
            backgroundColor: overHeroNight
              ? "rgba(20, 20, 20, 0.42)"
              : scrolled
                ? "rgba(246, 245, 240, 0.82)"
                : "rgba(255, 255, 255, 0.62)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: overHeroNight
              ? "0 8px 30px -12px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(246, 245, 240, 0.22)"
              : "0 8px 30px -12px rgba(20, 20, 20, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(20, 20, 20, 0.04)",
          }}
        >
          {/* Soft inner top specular highlight line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
          />

          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Miux Studio - Return to homepage"
              title="Miux Studio - Digital Design & Web Development Studio"
              className={cn(
                "group flex items-center shrink-0 whitespace-nowrap font-semibold tracking-tight transition-colors duration-1000 hover:opacity-80",
                overHeroNight ? "text-[#F6F5F0]" : "text-[#141414]",
              )}
            >
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Miux Studio"
                  width={32}
                  height={32}
                  priority
                  onError={() => setLogoError(true)}
                  className={cn(
                    "h-8 w-8 object-contain brightness-0 transition-[filter] duration-1000",
                    overHeroNight && "invert",
                  )}
                />
              ) : (
                <span
                  className={cn(
                    "tracking-[-0.03em] flex items-center font-semibold text-[15px] sm:text-base transition-colors duration-1000",
                    overHeroNight ? "text-[#F6F5F0]" : "text-[#141414]",
                  )}
                >
                  miux studio
                </span>
              )}
            </Link>

            {/* Desktop Center Links */}
            <div
              className="hidden shrink-0 items-center gap-1 md:flex"
              role="navigation"
              aria-label="Desktop navigation"
            >
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = isHomePage && activeSection === sectionId;

                return (
                  <a
                    key={link.label}
                    href={getHref(link.href)}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-label={`Navigate to ${link.label} section`}
                    title={`Explore ${link.label}`}
                    className={cn(
                      "relative inline-flex items-center justify-center text-center rounded-full px-3.5 sm:px-4 py-1.5 text-sm font-medium transition-colors duration-1000 select-none",
                      overHeroNight
                        ? isActive
                          ? "text-[#F6F5F0]"
                          : "text-[#F6F5F0]/80 hover:text-[#F6F5F0]"
                        : isActive
                          ? "text-[#141414]"
                          : "text-[#5C5A55] hover:text-[#141414]",
                    )}
                  >
                    {/* Liquid glass highlight pill gliding between links */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-highlight"
                        className={cn(
                          "absolute inset-0 rounded-full border backdrop-blur-md transition-colors duration-1000",
                          overHeroNight
                            ? "border-[#F6F5F0]/[0.18] bg-[#F6F5F0]/[0.12]"
                            : "border-[#141414]/[0.10] bg-[#141414]/[0.06]",
                        )}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 26,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Desktop Right CTA: Orange Gradient with White Text */}
            <Link
              href="/start"
              aria-label="Get Started with Miux Studio"
              title="Get Started with Miux Studio"
              className="relative group overflow-hidden hidden shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 border border-orange-600/20 font-semibold text-white transition-all duration-300 hover:brightness-105 active:scale-[0.98] md:inline-flex items-center justify-center gap-2 h-9 px-5 text-xs sm:text-sm shadow-[0_2px_12px_rgba(234,88,12,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              {/* Continuous Smooth Liquid Shine Sweep */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                animate={{ translateX: ["-100%", "220%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                  repeatDelay: 0.8,
                }}
              />
              <span className="relative z-10 text-white font-semibold">
                Get Started
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              title={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              className="relative -my-1 flex size-11 flex-col items-center justify-center gap-[5px] rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <motion.span
                className={cn(
                  "block h-[2px] w-5 rounded-full origin-center transition-colors duration-1000",
                  overHeroNight ? "bg-[#F6F5F0]" : "bg-[#141414]",
                )}
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 7 : 0,
                }}
                transition={{ type: "spring", stiffness: 340, damping: 25 }}
              />
              <motion.span
                className={cn(
                  "block h-[2px] w-5 rounded-full origin-center transition-colors duration-1000",
                  overHeroNight ? "bg-[#F6F5F0]" : "bg-[#141414]",
                )}
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className={cn(
                  "block h-[2px] w-5 rounded-full origin-center transition-colors duration-1000",
                  overHeroNight ? "bg-[#F6F5F0]" : "bg-[#141414]",
                )}
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -7 : 0,
                }}
                transition={{ type: "spring", stiffness: 340, damping: 25 }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="mt-2 origin-top overflow-hidden rounded-3xl border border-[#141414]/[0.10] p-5 md:hidden"
              style={{
                backgroundColor: "rgba(246, 245, 240, 0.94)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                boxShadow:
                  "0 18px 40px -16px rgba(20, 20, 20, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)",
              }}
            >
              <div
                className="flex flex-col gap-1.5"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={getHref(link.href)}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-label={`Navigate to ${link.label} section`}
                    title={`Explore ${link.label}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 350,
                      damping: 26,
                    }}
                    className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                      isHomePage && activeSection === link.href.replace("#", "")
                        ? "bg-[#141414]/[0.08] text-[#141414]"
                        : "text-[#5C5A55] hover:bg-[#141414]/[0.04] hover:text-[#141414]"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Full-width CTA inside open menu: Orange Gradient with Dark Mesh and White Text */}
              <MotionLink
                href="/start"
                aria-label="Get Started with Miux Studio"
                title="Get Started with Miux Studio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: NAV_LINKS.length * 0.05,
                  type: "spring",
                  stiffness: 350,
                  damping: 26,
                }}
                onClick={() => setMobileOpen(false)}
                className="relative group overflow-hidden mt-4 block w-full rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 border border-orange-400/40 py-3.5 text-center text-sm font-semibold text-white shadow-[0_2px_12px_rgba(249,115,22,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {/* Continuous Smooth Liquid Shine Sweep */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                  animate={{ translateX: ["-100%", "220%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut",
                    repeatDelay: 0.8,
                  }}
                />
                <span className="relative z-10 text-white font-semibold">
                  Get Started
                </span>
              </MotionLink>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */

const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Startups", href: "/startups" },
  { label: "Approach", href: "/#approach" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const FOOTER_SERVICES = [
  { label: "Brand Design and Identity", href: "/#services" },
  { label: "Web Design", href: "/#services" },
  { label: "Web Development", href: "/#services" },
  { label: "UI/UX Design", href: "/#services" },
  { label: "Ads and Other Campaigns", href: "/#services" },
];

const FOOTER_OTHERS = [
  { label: "Free Website Teardown", href: "/teardown" },
  { label: "Client Terms", href: "/client-terms" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  X: XIcon,
} as const;

export function Footer() {
  const cms = useCms();
  const site = cms.site;
  const socials = (cms.social.length ? cms.social : SOCIAL_LINKS.map(({ label, href }) => ({ label, href }))).map(
    (link) => ({
      ...link,
      Icon: SOCIAL_ICONS[link.label as keyof typeof SOCIAL_ICONS] ?? ArrowUpRight,
    }),
  );
  const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : "";

  return (
    <RuixenGradientFooter
      id="site-footer"
      gradientHeight="clamp(340px, 48vh, 560px)"
      minReveal={0}
      blur={30}
      peak={0.92}
      valley={0.5}
      className="relative border-t border-[#141414]/[0.08] bg-[#F6F5F0]"
    >
      <div
        className="relative z-10 overflow-hidden"
        style={{
          backgroundColor: "rgba(246, 245, 240, 0.85)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
      >
        {/* Subtle liquid background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)] blur-[90px]" />
        {/* Base background transition matching off-white colour (#F6F5F0) */}
        <div className="absolute bottom-0 inset-x-0 h-[380px] bg-gradient-to-b from-transparent via-[#F6F5F0]/85 to-[#F6F5F0] pointer-events-none" />
      </div>

      {/* Responsive 2-Col Mobile / 5-Col Desktop Grid */}
      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-2 gap-8 sm:gap-10 px-5 py-16 sm:py-20 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <span className="text-lg font-semibold tracking-tight text-[#141414]">
            Miux Studio
          </span>
          <p className="mt-4 text-sm leading-relaxed text-[#5C5A55] max-w-sm">
            Selective creative studio engineering brand systems and
            high-converting digital platforms.
          </p>
          <p className="mt-4 text-xs tracking-wider uppercase text-[#78756E]">
            {site.regionalScope || SITE.scopeLabel}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]">
            Navigation
          </h2>
          <nav
            className="mt-4 flex flex-col gap-3"
            aria-label="Footer navigation"
          >
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={`Go to ${item.label}`}
                title={`Visit ${item.label}`}
                className="rounded-sm text-sm text-[#5C5A55] transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]">
            Services
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {FOOTER_SERVICES.map((service) => (
              <li key={service.label}>
                <Link
                  href={service.href}
                  aria-label={`See ${service.label} services`}
                  title={`See ${service.label} services`}
                  className="rounded-sm text-sm text-[#5C5A55] transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Others */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]">
            Others
          </h2>
          <nav
            className="mt-4 flex flex-col gap-3"
            aria-label="Other resources"
          >
            {FOOTER_OTHERS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={`Go to ${item.label}`}
                title={`Visit ${item.label}`}
                className="rounded-sm text-sm text-[#5C5A55] transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Connect */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]">
            Connect
          </h2>
          <a
            href={phoneHref}
            aria-label={`Call Miux Studio at ${site.phone}`}
            title={`Call ${site.phone}`}
            className="mt-4 block text-[13px] text-[#5C5A55] transition-colors hover:text-orange-600"
          >
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            aria-label={`Send email to ${site.email}`}
            title="Email Miux Studio"
            className="mt-2 block text-sm text-[#5C5A55] transition-colors hover:text-orange-600"
          >
            {site.email}
          </a>
          <div className="mt-4 flex items-center gap-1 -ml-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={`Follow Miux Studio on ${label}`}
                title={`Miux Studio on ${label}`}
                className="inline-flex size-11 items-center justify-center rounded-full text-[#5C5A55] transition-colors hover:bg-white/70 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:size-9"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Centered "Book a Call" button directly above the giant text */}
      <div className="relative z-10 flex justify-center pb-8 pt-4">
        <Link
          href="/meeting"
          aria-label="Book a 45-minute discovery call with Miux Studio"
          title="Schedule a consultation call with Miux Studio"
          className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#141414] px-7 py-3 text-sm font-semibold text-[#F6F5F0] shadow-[0_2px_14px_rgba(20,20,20,0.18)] ring-1 ring-inset ring-white/15 transition-[background-color,box-shadow] hover:bg-[#262626] hover:shadow-[0_6px_24px_rgba(20,20,20,0.26)] select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
        >
          <span>Book a Call</span>
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Currently building strip */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-5">
        <div className="flex flex-col gap-2 border-t border-[#141414]/[0.08] py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-xs text-[#5C5A55]">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-500/60" />
              <span className="relative inline-flex size-2 rounded-full bg-orange-600" />
            </span>
            <span className="uppercase tracking-[0.18em]">
              Currently building
            </span>
            <span
              className="hidden h-3 w-px bg-[#141414]/15 sm:block"
              aria-hidden="true"
            />
          </p>
          <Link
            href="/work/solstice-ai-engine"
            className="group inline-flex items-center gap-1.5 text-xs text-[#2E2D2A] transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            An evaluation layer for a generative AI engine
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col justify-between gap-4 px-5 py-6 text-xs text-[#5C5A55] sm:flex-row sm:items-center">
        <span>
          &copy; {SITE.founded}–{new Date().getFullYear()}{" "}
          {SITE.name.toUpperCase()}. All rights reserved.
        </span>
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <Link
            href="/client-terms"
            className="rounded-sm transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Client Terms
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-sm transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-sm transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Terms
          </Link>
          <Link
            href="/sitemap"
            className="rounded-sm transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Sitemap
          </Link>
        </div>
      </div>

      </div>

      {/* Interactive WebGL Melting Footer Text — pinned to the viewport floor */}
      <FooterBrand text="miux" />
    </RuixenGradientFooter>
  );
}
