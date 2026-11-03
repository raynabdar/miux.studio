'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Sparkles, CheckCircle2 } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'

export default function MeetingPage() {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: 'special' })
        cal('ui', {
          theme: 'dark',
          hideEventTypeDetails: false,
          layout: 'month_view',
        })
      } catch (err) {
        console.error('Failed to initialize Cal.com embed:', err)
      }
    })()
  }, [])

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#141414] text-white">
      <Navbar />

      <main className="relative flex-1 px-5 pt-32 pb-24 sm:pt-36 sm:pb-32 overflow-hidden">
        {/* Ambient Warm Mesh Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,rgba(249,115,22,0.03)_50%,transparent_70%)] blur-[95px] z-0"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Top Header Content */}
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-10">
            {/* Pill 1: 48+ startups & founders choose miux.studio */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
              </span>
              <span>48+ startups &amp; founders choose miux.studio</span>
            </motion.div>

            {/* Main Heading: Book a 45-min Call */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl md:text-6xl"
            >
              Book a 45-min Call
            </motion.h1>

            {/* Subtitle with WhatsApp & Telegram Links */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: 'easeOut' }}
              className="text-base sm:text-lg text-[#A3A3A3] leading-relaxed"
            >
              Please select a date and time for the call, or just text me on{' '}
              <a
                href="https://wa.me/raynabdar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Text on WhatsApp"
                title="Open WhatsApp chat with raynabdar"
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 transition-colors hover:text-emerald-300 hover:decoration-emerald-300"
              >
                <MessageCircle className="size-4 inline -mt-0.5" />
                <span>WhatsApp</span>
              </a>{' '}
              or{' '}
              <a
                href="https://t.me/raynabdar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Text on Telegram"
                title="Open Telegram chat with raynabdar"
                className="inline-flex items-center gap-1 font-semibold text-sky-400 underline decoration-sky-400/40 underline-offset-4 transition-colors hover:text-sky-300 hover:decoration-sky-300"
              >
                <Send className="size-3.5 inline -mt-0.5" />
                <span>Telegram</span>
              </a>
            </motion.p>

            {/* Availability Badge: 3 spots available */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-2 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3 spots available.</span>
              </span>
            </motion.div>
          </div>

          {/* Cal.com Embedded Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[#1A1A1A] p-2 sm:p-4 min-h-[680px]"
          >
            <Cal
              namespace="special"
              calLink="raynabdar/special"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '650px',
                overflow: 'scroll',
              }}
              config={{
                layout: 'month_view',
                useSlotsViewOnSmallScreen: 'true',
              }}
            />
          </motion.div>

          {/* Direct Support Note */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#707070]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-orange-400" />
              <span>Direct senior partner consultation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-orange-400" />
              <span>Zero sales pressure &amp; clear fixed scope</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-orange-400" />
              <span>Asia &amp; UAE time zone friendly</span>
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
