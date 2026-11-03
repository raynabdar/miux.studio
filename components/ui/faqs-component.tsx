'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQsProps {
  items?: FAQItem[]
  className?: string
  title?: string
  description?: string
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'item-1',
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.',
  },
  {
    id: 'item-2',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.',
  },
  {
    id: 'item-3',
    question: 'Can I change or cancel my order?',
    answer:
      'You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.',
  },
  {
    id: 'item-4',
    question: 'Do you ship internationally?',
    answer:
      "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Additional customs fees may apply depending on your country's import regulations.",
  },
  {
    id: 'item-5',
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.',
  },
]

export default function FAQs({
  items = DEFAULT_FAQ_ITEMS,
  className,
  title = 'Frequently Asked Questions',
  description = 'Discover quick and comprehensive answers to common questions about our platform, services, and features.',
}: FAQsProps) {
  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className={cn('relative w-full bg-[#141414] py-20 md:py-28 text-white px-5 overflow-hidden', className)}
    >
      {/* Subtle liquid background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06)_0%,rgba(234,88,12,0.02)_40%,transparent_70%)] blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#707070]">
            05 / Clarifications
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A3A3A3] max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-12">
          {/* Liquid glass accordion container */}
          <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-2xl px-6 sm:px-8 py-3 transition-all duration-300 hover:border-white/[0.2]">
            {/* Liquid inner sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />

            <Accordion type="single" collapsible className="w-full">
              {items.map((item, idx) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className={cn(
                    'border-b border-white/[0.08] transition-colors duration-200',
                    idx === items.length - 1 && 'border-b-0'
                  )}
                >
                  <AccordionTrigger className="group py-5 text-left text-base sm:text-lg font-medium text-white hover:no-underline transition-colors hover:text-white/90">
                    <span className="flex-1 pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm sm:text-base leading-relaxed text-[#A3A3A3]">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-6 text-sm sm:text-base text-[#A3A3A3]">
            Can&apos;t find what you&apos;re looking for? Contact our{' '}
            <Link
              href="/contact"
              className="text-orange-400 font-medium hover:text-orange-300 hover:underline transition-colors"
            >
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export { FAQs }
