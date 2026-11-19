'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log unexpected runtime error
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center bg-[#F6F5F0] text-[#141414]">
      <div className="max-w-md space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-orange-600 font-mono">
          500 / Application Error
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-[#141414]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#5C5A55] leading-relaxed">
          An unexpected issue occurred while rendering this page. You can try refreshing the view or return to the homepage.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-full bg-[#141414] px-6 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-all hover:bg-[#262626] active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full border border-[#141414]/20 px-6 py-2.5 text-sm font-semibold text-[#141414] transition-all hover:bg-[#141414]/[0.06]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
