'use client'

import { useState } from 'react'
import { useCms } from '@/components/cms/cms-provider'

export default function DiscountBanner() {
  const { discount } = useCms()
  const [dismissed, setDismissed] = useState(false)
  if (!discount || dismissed) return null

  const ends = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(discount.endsAt)
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-xl items-start gap-3 rounded-2xl border border-orange-500/30 bg-[#141414] px-4 py-3 text-[#F6F5F0] shadow-lg">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {discount.title}
            <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
              {discount.amount}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-[#F6F5F0]/75">
            {discount.message} · ends {ends}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded-full px-2 py-0.5 text-lg leading-none text-[#F6F5F0]/60 hover:text-[#F6F5F0]"
        >
          ×
        </button>
      </div>
    </div>
  )
}
