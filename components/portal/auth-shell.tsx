import Link from 'next/link'
import AuthVisualPanel from '@/components/ui/auth-visual-panel'

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
    <main className="min-h-[100svh] w-full bg-[#F6F5F0] p-3 text-[#141414] sm:p-5">
      <div className="mx-auto grid min-h-[calc(100svh-1.5rem)] w-full max-w-[1440px] gap-3 sm:min-h-[calc(100svh-2.5rem)] sm:gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <section className="flex flex-col rounded-[28px] border border-[#141414]/10 bg-white/75 px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          <header className="flex items-center justify-between">
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

          <div className="flex flex-1 items-start py-10 lg:py-14">
            <div className="mx-auto w-full max-w-[440px]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
                Client portal
              </p>
              <h1 className="text-[28px] leading-tight tracking-[-0.04em] sm:text-4xl">{title}</h1>
              {subtitle && (
                <p className="mt-3 text-sm leading-relaxed text-[#5C5A55]">{subtitle}</p>
              )}
              <div className="mt-8">{children}</div>
            </div>
          </div>

          <p className="hidden text-[11px] text-[#8A857C] sm:block">
            Dhaka · Working across APAC and the UAE
          </p>
        </section>

        <AuthVisualPanel />
      </div>
    </main>
  )
}
