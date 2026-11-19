import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-5 py-24 text-center bg-[#F6F5F0] text-[#141414]">
      <div className="max-w-md space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-orange-600 font-mono">
          404 / Page Not Found
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-[#141414]">
          Lost in the void
        </h1>
        <p className="text-sm text-[#5C5A55] leading-relaxed">
          The page or resource you are looking for doesn&apos;t exist or has been relocated.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#141414] px-7 py-3 text-sm font-semibold text-[#F6F5F0] transition-all hover:bg-[#262626] active:scale-95"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
