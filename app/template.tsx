'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { SitePreloader } from '@/components/SitePreloader'

export default function Template({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0)

  /* ── Lenis smooth scroll + scroll-progress ──────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0) {
        setScrollProgress(window.scrollY / max)
      }
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* ── Glass Preloader (Dark with Website Logo) ─────────── */}
      <SitePreloader />

      {/* ── Thin white scroll progress bar at the very top ───── */}
      <div
        className="fixed left-0 top-0 z-[9990] h-[2px] w-full bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-white/70 origin-left transition-transform duration-75 ease-out"
          style={{
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </div>

      {/* ── Route transition (fade + slight upward slide, 0.5s ease-out) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* ── Thin dark grey overlay wipe for route transitions ── */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[9980] origin-top bg-[#1A1A1A]"
      />
    </>
  )
}
