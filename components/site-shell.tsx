"use client";

import PrismSilkFooter, { type PrismSilkSocialIcon } from "@/components/ui/prism-silk-footer";
import { SITE, SOCIAL_LINKS } from "@/lib/data";
import { useCms } from "@/components/cms/cms-provider";
import { setSmoothScrollEnabled } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
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

const FOOTER_COLUMNS = [
  {
    title: "Studio",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/#about" },
      { label: "Work", href: "/#work" },
      { label: "Approach", href: "/#approach" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Brand Design and Identity", href: "/#services" },
      { label: "Web Design", href: "/#services" },
      { label: "Web Development", href: "/#services" },
      { label: "UI/UX Design", href: "/#services" },
      { label: "Ads and Other Campaigns", href: "/#services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blogs" },
      { label: "Startups", href: "/startups" },
      { label: "Free Website Teardown", href: "/teardown", badge: "Free" },
      { label: "Book a Call", href: "/meeting", badge: "45 min" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Client Terms", href: "/client-terms" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

const SOCIAL_ICON_BY_LABEL: Record<string, PrismSilkSocialIcon> = {
  X: "x",
  Instagram: "instagram",
  LinkedIn: "linkedin",
  Facebook: "facebook",
};

export function Footer() {
  const cms = useCms();
  const socials = (cms.social.length ? cms.social : SOCIAL_LINKS).flatMap(({ label, href }) => {
    const icon = SOCIAL_ICON_BY_LABEL[label];
    return icon ? [{ icon, href, label }] : [];
  });

  return (
    <PrismSilkFooter
      id="site-footer"
      name="Miux Studio"
      brandHref="/"
      tagline="Selective creative studio in Dhaka, engineering brand systems and high-converting digital platforms for teams across APAC and the UAE."
      location="Bangladesh-based — serving APAC and the UAE"
      email="hello@miux.studio"
      cta={{ label: "Book a Call", href: "/meeting" }}
      wordmark="miux"
      columns={FOOTER_COLUMNS}
      socials={socials}
      copyright={`© ${SITE.founded}–${new Date().getFullYear()} ${SITE.name.toUpperCase()}. All rights reserved.`}
      credit={{ label: "Miux Studio", href: "/" }}
      preset="ember"
      palette={{
        paperTop: "#F6F5F0",
        ink: "#141414",
        muted: "#5C5A55",
        line: "rgba(20, 20, 20, 0.12)",
      }}
      grain={0}
      maxWidth="1200px"
      fontFamily="var(--font-geist-sans)"
      stageMinHeight="380px"
    />
  );
}
