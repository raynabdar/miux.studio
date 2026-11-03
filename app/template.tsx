'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { CustomCursor } from '@/components/custom-cursor'

export default function Template({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  /* ── Preloader (under 1.2s, once per session) ───────────── */
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('miux_preloaded') === 'true'
      if (!seen) {
        sessionStorage.setItem('miux_preloaded', 'true')
        setShowPreloader(true)
        const timer = setTimeout(() => setShowPreloader(false), 1050)
        return () => clearTimeout(timer)
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [])

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
      <CustomCursor />

      {/* ── Preloader ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#141414]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <span className="text-5xl font-bold tracking-[-0.08em] text-white sm:text-7xl">
                MIUX
              </span>
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#707070]">
                Creative Agency
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
