'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { SitePreloader } from '@/components/SitePreloader'
import { registerLenis } from '@/lib/smooth-scroll'
import { useSkipMountAnimation } from '@/lib/use-skip-mount-animation'

export default function Template({ children }: { children: React.ReactNode }) {
  const progressRef = useRef<HTMLDivElement>(null)
  const skipMountAnimation = useSkipMountAnimation()

  /* ── Lenis smooth scroll + scroll-progress ──────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    })
    registerLenis(lenis)

    let frame = 0
    let lastProgress = -1
    const raf = (time: number) => {
      lenis.raf(time)
      // Lenis exposes its progress without forcing a layout read each frame.
      const progress = lenis.progress
      const bar = progressRef.current
      if (bar && Number.isFinite(progress) && Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress
        bar.style.transform = `scaleX(${progress})`
      }
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      registerLenis(null)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* ── Glass Preloader (Off-White with Dark Website Logo) ── */}
      <SitePreloader />

      {/* ── Thin dark ink scroll progress bar at the very top ── */}
      <div
        className="fixed left-0 top-0 z-[9990] h-[2px] w-full bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          ref={progressRef}
          className="h-full origin-left bg-[#141414]/75"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── Route transition (fade + slight upward slide, 0.5s ease-out) ── */}
      <motion.div
        initial={skipMountAnimation ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* ── Thin off-white overlay wipe for route transitions ── */}
      <motion.div
        initial={skipMountAnimation ? { scaleY: 0 } : { scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[9980] origin-top bg-[#ECEAE3]"
      />
    </>
  )
}
