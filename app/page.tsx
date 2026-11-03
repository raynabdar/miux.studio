'use client'

import Image from 'next/image'
import { useEffect, useState, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  MoveDown,
  Sparkles,
} from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { MagneticButton } from '@/components/magnetic-button'
import { ShinyButton } from '@/components/ui/shiny-button'
import { SquigglyText } from '@/components/ui/squiggly-text'
import { NoiseBackground } from '@/components/ui/noise-background'
import {
  projects,
  projectCategories,
  aboutHistory,
  type Project,
  type ProjectCategory,
} from '@/lib/data'
import Pricing from '@/components/ui/pricing'
import Testimonials from '@/components/ui/testimonial'
import FAQs from '@/components/ui/faqs-component'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/* ── Animation variants ─────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

/* ───────────────────────────────────────────────────────────────────── */
/*  2. HERO (id="home")                                                  */
/* ───────────────────────────────────────────────────────────────────── */

const founderAvatars = [
  {
    name: 'Alex Rivera',
    role: 'Founder, Zenith',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  },
  {
    name: 'Sarah Chen',
    role: 'CEO, Vertex AI',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
  },
  {
    name: 'Marcus Brody',
    role: 'CTO, Prism Labs',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
  },
  {
    name: 'Elena Rostova',
    role: 'Co-Founder, HyperScale',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
  },
  {
    name: 'David Kim',
    role: 'Product Lead, Kintsugi',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
  },
]

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const heroVideoSrc = '/hero.mp4'

  // Dynamic month: changes dynamically after month ends (e.g. 'November')
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())

  /* Guaranteed smooth autoplay across all browsers */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoLoaded(true)
        })
        .catch(() => {
          // If browser restricts un-interacted autoplay, trigger on first passive user gesture
          const handleFirstGesture = () => {
            video.play()
            setIsVideoLoaded(true)
            window.removeEventListener('click', handleFirstGesture)
            window.removeEventListener('touchstart', handleFirstGesture)
            window.removeEventListener('scroll', handleFirstGesture)
          }
          window.addEventListener('click', handleFirstGesture, { once: true, passive: true })
          window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true })
          window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true })
        })
    }
  }, [])

  /* Parallax for video */
  useEffect(() => {
    const onScroll = () => {
      if (!videoRef.current) return
      videoRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.22}px, 0)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="home"
      aria-label="Websites for Brands and Digital Businesses"
      className="relative flex min-h-[85vh] lg:min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#141414] px-5 pt-32 pb-12 sm:pt-36 sm:pb-14"
    >
      {/* Aesthetic Mesh Orange Ambient Lighting & Video */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#141414]" aria-hidden="true">
        {/* Poster image fallback underlay for instant zero-flash render */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out opacity-25"
          style={{ backgroundImage: "url('/hero-poster.jpg')" }}
        />

        {/* Video layer: smooth transition, muted autoplay, loop */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/hero-poster.jpg"
          onLoadedData={() => setIsVideoLoaded(true)}
          onPlaying={() => setIsVideoLoaded(true)}
          className={cn(
            'size-full object-cover will-change-transform transition-opacity duration-1000 ease-out',
            isVideoLoaded ? 'opacity-35' : 'opacity-20'
          )}
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>

        {/* Layered Orange Mesh Gradient Orbs over video for vibrant depth */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.2)_0%,rgba(234,88,12,0.08)_45%,transparent_70%)] blur-[80px]" />
        <div className="absolute top-[20%] left-[8%] w-[500px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.13)_0%,transparent_65%)] blur-[90px]" />
        <div className="absolute top-[24%] right-[8%] w-[520px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.15)_0%,transparent_65%)] blur-[100px]" />

        {/* Ambient Dark Gradation resolving cleanly into #141414 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#141414_82%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/50 via-transparent to-[#141414]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        {/* Availability Badge: Taking projects for 'November' */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-1.5 text-xs text-[#A3A3A3] backdrop-blur-md hover:border-orange-500/40 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
          <span>
            Taking projects for &apos;{currentMonth}&apos;
          </span>
        </motion.div>

        {/* SEO-Optimized Hero Heading: Websites for Brands & Digital Businesses */}
        <div className="overflow-hidden max-w-5xl">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.95]"
          >
            Websites for Brands &amp; Digital Businesses
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base text-[#A3A3A3] sm:text-lg md:text-xl font-normal leading-relaxed"
        >
          Get a website or Custom business website that fulfill your goals &amp; drive sales.
        </motion.p>

        {/* Hoverable Bar with 5 Avatars, Text, and Outline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="my-9 group relative inline-flex items-center gap-3.5 rounded-full border border-white/[0.15] bg-white/[0.03] px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06] cursor-pointer"
        >
          {/* 5 Hoverable Overlapping Avatars (Minimalist without name labels) */}
          <div className="flex -space-x-2.5 overflow-visible">
            {founderAvatars.map((founder, i) => (
              <div
                key={i}
                className="group/avatar relative size-8 sm:size-9 rounded-full border-2 border-[#141414] bg-[#1A1A1A] transition-all duration-200 hover:scale-125 hover:z-30 hover:border-white/60 cursor-pointer"
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

          {/* Bar Text with Outline & subtle rating */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
            <span className="font-semibold text-white tracking-tight">
              48+ startups &amp; founders
            </span>
            <span className="text-[#A3A3A3]">choose miux.studio</span>
            <span className="hidden sm:inline-flex items-center text-orange-400 text-xs ml-0.5">
              ★★★★★
            </span>
          </div>
        </motion.div>

        {/* Action Buttons with SEO attributes */}
        <div className="flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <ShinyButton
            href="/meeting"
            label="Book a 45-min call"
            aria-label="Book a 45-minute discovery call with Miux Studio"
            title="Schedule a consultation call with Miux Studio"
            className="w-full sm:w-auto group"
          >
            <span className="inline-flex items-center gap-2">
              <span>Book a 45-min call</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </ShinyButton>

          <MagneticButton
            href="#work"
            variant="secondary"
            aria-label="Explore our work and client case studies"
            title="View Miux Studio portfolio"
            className="w-full px-8 py-3.5 text-sm sm:w-auto"
          >
            <span>View our work</span>
          </MagneticButton>
        </div>

        {/* Trusted By Row with Rotated Sticker Badges (Linked) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#707070]">
          <span className="uppercase tracking-[0.2em]">Trusted by</span>

          {/* Trustpilot Badge */}
          <a
            href="https://www.trustpilot.com/review/miux.studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Miux Studio on Trustpilot"
            title="View Miux Studio on Trustpilot"
            className="-rotate-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 font-medium text-white/80 transition-all duration-200 hover:rotate-0 hover:border-orange-500/50 hover:text-white"
          >
            <Sparkles className="size-3 text-orange-400" />
            <span>Trustpilot Certified</span>
          </a>

          {/* Clutch Badge */}
          <a
            href="https://clutch.co/profile/miux-studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Miux Studio on Clutch"
            title="View Miux Studio on Clutch"
            className="rotate-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 font-medium text-white/80 transition-all duration-200 hover:rotate-0 hover:border-orange-500/50 hover:text-white"
          >
            <svg
              className="size-3 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Clutch Certified</span>
          </a>
        </div>

        {/* Animated Scroll Down Indicator */}
        <a
          href="#about"
          aria-label="Scroll to about section"
          className="mt-6 mb-0 transition-opacity hover:opacity-100"
        >
          <MoveDown className="size-4 animate-bounce text-white/40 hover:text-orange-400 transition-colors" />
        </a>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────────── */
/*  3. ABOUT (id="about")                                                */
/* ───────────────────────────────────────────────────────────────────── */

function About() {
  const aboutRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [lineInView, setLineInView] = useState(false)

  // Orange glow scroll synchronization: only sticks & appears during the About section on the home page
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ['start end', 'end start'],
  })

  // Smooth appearance: fades in as About enters viewport, remains active throughout, and cleanly fades out upon exiting
  const glowOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0])
  const glowScale = useTransform(scrollYProgress, [0.05, 0.5, 0.95], [0.85, 1.08, 0.85])

  useEffect(() => {
    if (!lineRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLineInView(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(lineRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={aboutRef}
      id="about"
      aria-label="About Miux Studio"
      className="relative bg-[#141414] px-5 pt-4 sm:pt-8 pb-20 sm:pb-28 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Orange Glow positioned right at the corner of the "About" text */}
        <div className="pointer-events-none absolute -top-14 -left-10 sm:-left-16 sm:-top-16 z-0 overflow-visible">
          <motion.div
            style={{ opacity: glowOpacity, scale: glowScale }}
            aria-hidden="true"
            className="pointer-events-none"
          >
            <div className="h-[260px] w-[260px] sm:h-[360px] sm:w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22)_0%,rgba(249,115,22,0.06)_45%,transparent_70%)] blur-[70px]" />
          </motion.div>
        </div>

        {/* Section header */}
        <div className="overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#707070]">
              01 / Studio History & Philosophy
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              About
            </h2>
          </motion.div>
        </div>

        {/* 2 to 3 paragraph history */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 grid gap-8 text-base leading-relaxed text-[#A3A3A3] md:grid-cols-3 sm:text-lg"
        >
          {aboutHistory.map((paragraph, index) => (
            <motion.p key={index} variants={fadeUp}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Large Centered Quote with Animated Line Drawing Left to Right */}
        <div className="mt-28" ref={lineRef}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 h-px origin-left bg-gradient-to-r from-white/30 via-white/15 to-transparent"
          />

          <motion.blockquote
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
          >
            &ldquo;<SquigglyText scale={[5, 8]} stepDuration={85}>Build great stuff.</SquigglyText>&rdquo;
          </motion.blockquote>

          <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-[#707070]">
            The Miux Studio Standard
          </p>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────────── */
/*  4. WORK (id="work")                                                  */
/* ───────────────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  onClick,
}: {
  project: Project
  onClick: () => void
}) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.button
      ref={cardRef}
      layout
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      aria-label={`View case study for ${project.title} (${project.category})`}
      title={`View case study: ${project.title}`}
      className="group relative w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
    >
      <div
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161616] p-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-orange-500/40 min-h-[380px]"
        style={
          isHovered
            ? {
                background: `radial-gradient(460px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.14), rgba(249,115,22,0.03) 40%, transparent 70%), #161616`,
              }
            : undefined
        }
      >
        {/* Background Project Image in very low opacity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={project.image || '/placeholder.jpg'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-[0.14] transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-[0.24]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/75 to-[#141414]/40" />
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full border border-white/[0.12] bg-[#141414]/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#A3A3A3] backdrop-blur-sm transition-colors group-hover:border-orange-500/30 group-hover:text-orange-200">
            {project.category}
          </span>

          {/* "View project" chip on Work cards (fade in on hover with warm orange glow) */}
          <span className="rounded-full border border-orange-500/40 bg-orange-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-orange-200 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            View project
          </span>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 mt-24">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white transition-colors duration-200 group-hover:text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#A3A3A3]">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4 transition-colors group-hover:border-orange-500/20">
            {project.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="text-xs text-[#707070] transition-colors group-hover:text-[#A3A3A3]"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function Work() {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')
  const [selected, setSelected] = useState<Project | null>(null)

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.category === filter)

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="bg-[#141414] px-5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#707070]">
              02 / Portfolio
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              Work
            </h2>
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Portfolio category filter tabs">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              aria-label={`Filter projects by ${cat}`}
              title={`Show ${cat} projects`}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                filter === cat
                  ? 'border border-white bg-white text-[#141414]'
                  : 'border border-white/[0.12] bg-white/[0.02] text-[#A3A3A3] hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Grid of 6 Projects */}
        <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
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

          {/* Larger image area */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/10 to-[#141414]">
            <Image
              src={selected?.image || '/placeholder.jpg'}
              alt={selected?.title || 'Project preview'}
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              loading="lazy"
              className="object-cover"
            />
          </div>

          {/* Services Used */}
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

            {/* Result Summary (No exact numbers) */}
            <div className="border-t border-white/[0.08] pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                Result Summary
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#A3A3A3]">
                {selected?.result}
              </p>
            </div>
          </div>

          {/* Visit Project Button */}
          <div className="mt-4 flex justify-end">
            <a
              href="/meeting"
              aria-label={`Inquire about a project similar to ${selected?.title || 'this project'}`}
              title={`Inquire about ${selected?.title || 'project'}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
            >
              <span>Visit project</span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
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

function FinalCTA() {
  return (
    <section
      id="final-cta"
      aria-label="Call to action"
      className="relative bg-[#141414] px-5 py-28 text-center sm:py-36 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="overflow-hidden">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl font-semibold tracking-[-0.07em] text-white sm:text-6xl md:text-7xl"
          >
            Ready to stop losing customers to your website?
          </motion.h2>
        </div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-7 max-w-xl text-base text-[#A3A3A3] sm:text-lg"
        >
          Selective partnerships. Measurable growth. Tell us where you want to take your brand.
        </motion.p>

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
            title="Schedule a consultation call with Miux Studio"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-base font-semibold text-[#141414] transition-colors hover:bg-white/90 select-none"
          >
            <span>Book a 45-min call</span>
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────────── */
/*  MAIN PAGE EXPORT                                                     */
/* ───────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Work />
        <Pricing />
        <Testimonials />
        <FAQs />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
