'use client'

import { useId } from 'react'
import { BarChart3, ChevronDown, Spline } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChartView } from './metric-chart'

export interface PeriodOption {
  label: string
  points?: number
}

interface ViewToggleProps {
  value: ChartView
  onChange: (view: ChartView) => void
  className?: string
}

const VIEWS = [
  { value: 'curve' as const, label: 'Curve view', icon: Spline },
  { value: 'bars' as const, label: 'Bar view', icon: BarChart3 },
]

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Chart view"
      className={cn(
        'pointer-events-auto flex items-center gap-0.5 rounded-full border border-[#141414]/[0.10] bg-[#ECEAE3]/70 p-0.5',
        className,
      )}
    >
      {VIEWS.map((option) => {
        const Icon = option.icon
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex size-6 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
              selected
                ? 'bg-[#141414] text-[#F6F5F0]'
                : 'text-[#78756E] hover:text-[#141414]',
            )}
          >
            <Icon size={12} strokeWidth={2.25} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

interface PeriodSelectProps {
  value: string
  options: PeriodOption[]
  onChange: (option: PeriodOption) => void
  accentText?: string
  className?: string
}

export function PeriodSelect({
  value,
  options,
  onChange,
  className,
}: PeriodSelectProps) {
  const selectId = `period-${useId().replace(/:/g, '')}`

  return (
    <div className={cn('pointer-events-auto relative', className)}>
      <label className="sr-only" htmlFor={selectId}>
        Time range
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => {
          const next = options.find((option) => option.label === event.target.value)
          if (next) onChange(next)
        }}
        className="cursor-pointer appearance-none rounded-full border border-[#141414]/[0.10] bg-white py-1 pl-2.5 pr-6 text-[11px] font-medium text-[#2E2D2A] transition-colors hover:border-[#141414]/[0.22] hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 [&>option]:bg-white [&>option]:text-[#141414]"
      >
        {options.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        strokeWidth={2.25}
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#737373]"
      />
    </div>
  )
}
