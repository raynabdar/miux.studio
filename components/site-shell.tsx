'use client'

import { useEffect, useState, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Social Icons (Custom SVG) ─────────────────────────────────────── */

function FacebookIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function InstagramIcon({ className = 'size-5' }: { className?: string }) {
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
  )
}

function XIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/* ─── Constants ─────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
] as const

const SECTION_IDS = ['home', 'about', 'work', 'pricing'] as const

/* ─── Navbar ────────────────────────────────────────────────────────── */

export function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const getHref = useCallback(
    (hash: string) => (isHomePage ? hash : `/${hash}`),
    [isHomePage]
  )

  /* ── Auto-shrink on scroll with hysteresis & RAF ────────────────── */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          setScrolled((prev) => {
            // Hysteresis dead-zone prevents micro-stutter near the threshold
            if (prev) {
              return y > 20
            }
            return y > 50
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section on scroll ─────────────────────────────────────── */
  useEffect(() => {
    if (!isHomePage) return

    const handleScroll = () => {
      // Offset point inside the viewport (upper-middle area)
      const viewportPoint = window.scrollY + window.innerHeight * 0.38
      const sections = ['pricing', 'work', 'about', 'home'] as const

      let matched = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (viewportPoint >= top && viewportPoint < top + height) {
            matched = id
            break
          }
        }
      }

      // When scrolled past pricing (e.g. into testimonials, faq, or footer),
      // matched is '' so pricing indicator turns off until user re-enters pricing
      setActiveSection(matched)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  /* ── Close mobile menu on outside click or Escape ─────────────────── */
  useEffect(() => {
    if (!mobileOpen) return

    const onClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('click', onClickOutside, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onClickOutside, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  /* ── Lock body scroll when mobile menu is open ────────────────────── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  /* ── Focus trap inside mobile menu ────────────────────────────────── */
  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return

    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', trap)
    first.focus()
    return () => document.removeEventListener('keydown', trap)
  }, [mobileOpen])

  /* ── Link click: smooth scroll & heading animation ────────────────── */
  const handleLinkClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      if (!isHomePage) return // Allow full navigation to /#id
      e.preventDefault()
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        // Trigger heading subtle attention slide/fade if found
        const heading = el.querySelector('h2, h1')
        if (heading) {
          heading.animate(
            [
              { opacity: 0.6, transform: 'translateY(6px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          )
        }
      }
      setActiveSection(id)
      setMobileOpen(false)
    },
    [isHomePage]
  )

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed left-1/2 top-4 z-50 -translate-x-1/2 w-[calc(100%-2rem)] transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "max-w-[760px]" : "max-w-[960px]"
        )}
      >
        <nav
          className="relative overflow-hidden rounded-full border border-white/[0.16] py-2.5 px-4 sm:px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            backgroundColor: scrolled ? 'rgba(20, 20, 20, 0.42)' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Soft inner top specular highlight line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />

          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a
              href="/"
              aria-label="Miux Studio - Return to homepage"
              title="Miux Studio - Digital Design & Web Development Studio"
              className="group flex items-center shrink-0 whitespace-nowrap font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <span className="tracking-[-0.03em] flex items-center font-semibold text-white text-[15px] sm:text-base">
                Miux Studio
              </span>
            </a>

            {/* Desktop Center Links */}
            <div className="hidden shrink-0 items-center gap-1 md:flex" role="navigation" aria-label="Desktop navigation">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive = isHomePage && activeSection === sectionId

                return (
                  <a
                    key={link.label}
                    href={getHref(link.href)}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-label={`Navigate to ${link.label} section`}
                    title={`Explore ${link.label}`}
                    className={`relative rounded-full px-3.5 sm:px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    {/* Liquid glass highlight pill gliding between links */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-highlight"
                        className="absolute inset-0 rounded-full border border-white/[0.18] bg-white/[0.10] backdrop-blur-md"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 26,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                )
              })}
            </div>

            {/* Desktop Right CTA */}
            <a
              href="/meeting"
              aria-label="Book a 45-minute discovery call with Miux Studio"
              title="Schedule a consultation call with Miux Studio"
              className="hidden shrink-0 whitespace-nowrap rounded-full bg-white font-semibold text-[#141414] transition-all duration-300 hover:bg-white/95 md:inline-flex items-center justify-center gap-2 h-9 px-4.5 text-xs sm:text-sm"
            >
              <span>Book a Call</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              title={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              className="relative flex size-9 flex-col items-center justify-center gap-[5px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <motion.span
                className="block h-[2px] w-5 rounded-full bg-white origin-center"
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 7 : 0,
                }}
                transition={{ type: 'spring', stiffness: 340, damping: 25 }}
              />
              <motion.span
                className="block h-[2px] w-5 rounded-full bg-white origin-center"
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-[2px] w-5 rounded-full bg-white origin-center"
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -7 : 0,
                }}
                transition={{ type: 'spring', stiffness: 340, damping: 25 }}
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
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="mt-2 origin-top overflow-hidden rounded-3xl border border-white/[0.16] p-5 md:hidden"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.52)',
                backdropFilter: 'blur(28px) saturate(190%)',
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="flex flex-col gap-1.5" role="navigation" aria-label="Mobile navigation">
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
                      type: 'spring',
                      stiffness: 350,
                      damping: 26,
                    }}
                    className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                      isHomePage && activeSection === link.href.replace('#', '')
                        ? 'bg-white/[0.08] text-white'
                        : 'text-[#A3A3A3] hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Full-width CTA inside open menu only */}
              <motion.a
                href="/meeting"
                aria-label="Book a 45-minute discovery call with Miux Studio"
                title="Schedule a consultation call with Miux Studio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: NAV_LINKS.length * 0.05,
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 block w-full rounded-full bg-white py-3.5 text-center text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
              >
                Book a Call
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────── */

const FOOTER_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#work' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Book a Call', href: '/meeting' },
  { label: 'Contact', href: '/contact' },
]

const FOOTER_SERVICES = [
  'Brand Design and Identity',
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'Ads and Other Campaigns',
]

const FOOTER_SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/Miuxstudio', Icon: FacebookIcon },
  { label: 'LinkedIn', href: '#', Icon: LinkedInIcon },
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'X', href: '#', Icon: XIcon },
]

export function Footer() {
  const [giantHovered, setGiantHovered] = useState(false)

  return (
    <footer className="relative overflow-hidden bg-[#141414] border-t border-white/[0.08]">
      {/* 4-Column Grid */}
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 md:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Miux Studio
          </span>
          <p className="mt-4 text-sm leading-relaxed text-[#A3A3A3]">
            Selective creative studio engineering brand systems and high-converting digital platforms.
          </p>
          <p className="mt-4 text-xs tracking-wider uppercase text-[#707070]">
            Serving Asia and the UAE
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#707070]">
            Navigation
          </h2>
          <nav className="mt-4 flex flex-col gap-3" aria-label="Footer navigation">
            {FOOTER_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={`Go to ${item.label}`}
                title={`Visit ${item.label}`}
                className="text-sm text-[#A3A3A3] transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#707070]">
            Services
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {FOOTER_SERVICES.map((service) => (
              <li key={service} className="text-sm text-[#A3A3A3]">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#707070]">
            Connect
          </h2>
          <a
            href="mailto:hello@miux.studio"
            aria-label="Send email to hello@miux.studio"
            title="Email Miux Studio"
            className="mt-4 block text-sm text-[#A3A3A3] transition-colors hover:text-white"
          >
            hello@miux.studio
          </a>
          <div className="mt-6 flex items-center gap-4">
            {FOOTER_SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={`Follow Miux Studio on ${label}`}
                title={`Miux Studio on ${label}`}
                className="text-[#A3A3A3] transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Centered "Book a Call" button directly above the giant text */}
      <div className="flex justify-center pb-8 pt-4">
        <a
          href="/meeting"
          aria-label="Book a 45-minute discovery call with Miux Studio"
          title="Schedule a consultation call with Miux Studio"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-white/90 select-none"
        >
          <span>Book a Call</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Bottom row */}
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-4 border-t border-white/[0.08] px-5 py-6 text-xs text-[#707070] sm:flex-row sm:items-center">
        <span>© 2026 Miux Studio. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="/privacy" className="transition-colors hover:text-[#A3A3A3]">
            Privacy Policy
          </a>
          <a href="/terms" className="transition-colors hover:text-[#A3A3A3]">
            Terms
          </a>
        </div>
      </div>

      {/* Giant MIUX Text: white-to-transparent gradient fading into #141414 via mask-image, slightly cut off, brightens on hover */}
      <div
        className="relative select-none overflow-hidden cursor-default"
        onMouseEnter={() => setGiantHovered(true)}
        onMouseLeave={() => setGiantHovered(false)}
      >
        <p
          className="whitespace-nowrap text-center text-[28vw] font-bold leading-[0.68] tracking-[-0.08em] text-transparent transition-opacity duration-500 ease-out"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.05) 75%, transparent 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            opacity: giantHovered ? 0.35 : 0.18,
            maskImage: 'linear-gradient(to bottom, #141414 20%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #141414 20%, transparent 95%)',
            marginBottom: '-0.12em',
          }}
          aria-hidden="true"
        >
          MIUX
        </p>
      </div>
    </footer>
  )
}
