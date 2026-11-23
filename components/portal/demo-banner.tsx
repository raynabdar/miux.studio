export default function DemoModeBanner({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
      <span className="inline-block h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />
      <p className="text-xs font-medium text-[#9A3412]">
        Demo mode — {label} is read-only. No emails are sent and changes are disabled.
      </p>
    </div>
  )
}
