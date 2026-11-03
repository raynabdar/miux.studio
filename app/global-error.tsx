'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="bg-[#141414] text-white m-0 min-h-screen flex items-center justify-center font-sans antialiased">
        <main className="max-w-md p-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-orange-400 font-mono">
            System Alert
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Application encountered an issue</h1>
          <p className="text-sm text-[#A3A3A3] leading-relaxed">
            A critical error interrupted the application. Please reload to restore full functionality.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#141414] transition-all hover:bg-white/90 active:scale-95"
          >
            Reload Application
          </button>
        </main>
      </body>
    </html>
  )
}
