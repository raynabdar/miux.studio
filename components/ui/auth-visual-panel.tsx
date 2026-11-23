'use client'

import { GrainGradient } from '@paper-design/shaders-react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function AuthVisualPanel() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative flex min-h-[320px] overflow-hidden rounded-[24px] bg-[#141414] sm:min-h-[400px] lg:min-h-0">
      <GrainGradient
        speed={prefersReducedMotion ? 0 : 0.35}
        scale={1}
        rotation={0}
        offsetX={0}
        offsetY={0}
        softness={0.55}
        intensity={0.42}
        noise={0.2}
        shape="corners"
        colors={['#F6F5F0', '#FC7819', '#FC7819', '#F6F5F0']}
        colorBack="#141414"
        width="100%"
        height="100%"
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between gap-12 p-6 text-[#F6F5F0] sm:p-12 xl:p-14">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F6F5F0]/80">
          <span>Miux Studio</span>
          <span>Dhaka · APAC &amp; UAE</span>
        </div>

        <div>
          <h2 className="max-w-[560px] text-3xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl xl:text-6xl">
            Websites for brands &amp; digital businesses.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#F6F5F0]/90">
            Your project, feedback, and next steps — in one place.
          </p>
          <Link
            href="/work"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#F6F5F0]/35 bg-[#141414]/25 px-5 py-2.5 text-sm font-medium text-[#F6F5F0] backdrop-blur-sm transition-colors hover:border-[#F6F5F0]/60 hover:bg-[#141414]/35"
          >
            See our work
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-[11px] text-[#F6F5F0]/70">© Miux Studio</p>
      </div>
    </div>
  )
}
