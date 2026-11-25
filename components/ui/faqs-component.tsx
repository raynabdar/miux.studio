'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProgressiveBlur } from '@/components/ProgressiveBlur'
import { BlurRevealTitle } from '@/components/ui/blur-reveal-title'
import { cn } from '@/lib/utils'

export interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQsProps {
  items: FAQItem[]
  className?: string
  title?: string
  description?: string
}

export default function FAQs({
  items,
  className,
  title = 'Frequently Asked Questions',
  description = 'Answers to the questions we hear most often before a project starts.',
}: FAQsProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className={cn('relative w-full bg-[#F6F5F0] py-20 md:py-28 text-[#141414] px-5 overflow-hidden', className)}
    >
      {/* Subtle liquid background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,rgba(234,88,12,0.03)_40%,transparent_70%)] blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center flex flex-col items-center">
          <BlurRevealTitle as="h2" className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-[#141414] text-center">
            {title}
          </BlurRevealTitle>
          <p className="mt-4 text-base sm:text-lg text-[#5C5A55] max-w-2xl leading-relaxed text-center">
            {description}
          </p>
        </div>

        <div className="mt-12">
          {/* Liquid glass accordion container */}
          <div className="relative rounded-2xl border border-[#141414]/[0.10] bg-white/75 backdrop-blur-2xl px-6 sm:px-8 py-3 shadow-[0_12px_36px_-18px_rgba(20,20,20,0.08)] transition-all duration-300 hover:border-[#141414]/[0.18]">
            {/* Liquid inner sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            />

            <div className="divide-y divide-[#141414]/[0.08]">
              {items.map((item) => {
                const isOpen = Boolean(openIds[item.id])
                const panelId = `faq-panel-${item.id}`
                const triggerId = `faq-trigger-${item.id}`

                return (
                  <div key={item.id}>
                    <button
                      id={triggerId}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center gap-4 py-5 text-left text-base font-medium text-[#141414] transition-colors hover:text-[#141414]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:text-lg"
                    >
                      <span className="flex-1 pr-4">{item.question}</span>
                      <Plus
                        aria-hidden="true"
                        className={cn(
                          'size-4 shrink-0 text-[#5C5A55] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          isOpen && 'rotate-45 text-orange-600',
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="relative overflow-hidden"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              filter: 'blur(0px)',
                              transitionEnd: { filter: 'none' },
                            }}
                            exit={{ opacity: 0, y: -4, filter: 'blur(5px)' }}
                            transition={{
                              duration: 0.42,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="pb-5 text-sm leading-relaxed text-[#5C5A55] sm:text-base"
                          >
                            <p>{item.answer}</p>
                          </motion.div>

                          {/* Progressive blur veil dissolving cleanly during open/close */}
                          <motion.div
                            aria-hidden="true"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0.9 }}
                            transition={{
                              duration: 0.5,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                          >
                            <ProgressiveBlur
                              direction="bottom"
                              blurLayers={6}
                              blurIntensity={0.65}
                              className="absolute inset-0 h-full w-full"
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 space-y-2 text-center text-sm sm:text-base text-[#5C5A55]">
            <p>
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link
                href="/contact"
                className="text-orange-700 font-medium hover:text-orange-600 hover:underline transition-colors"
              >
                Talk to our team
              </Link>
            </p>
            <p>
              <Link
                href="/blogs"
                className="text-[#2E2D2A] underline decoration-[#141414]/25 decoration-1 underline-offset-4 transition-colors hover:text-[#141414] hover:decoration-orange-600"
              >
                Read our blogs to know more.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FAQs }
