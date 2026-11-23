import Link from 'next/link'

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          Miux Studio
        </Link>
        <Link
          href="/start"
          className="text-xs text-[#5C5A55] underline-offset-4 transition-colors hover:text-[#141414] hover:underline"
        >
          Start a project
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
        <div className="w-full max-w-md">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Client portal
          </p>
          <h1 className="mb-1 text-2xl tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mb-6 text-sm leading-relaxed text-[#5C5A55]">{subtitle}</p>}
          <div className="mt-6 rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
