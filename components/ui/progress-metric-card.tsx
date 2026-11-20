'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ACCENTS,
  formatCompact,
  MetricChart,
  SERIES_COLORS,
  type ChartSeries,
  type ChartView,
  type MetricAccent,
  type MetricSeries,
  type SeriesPoint,
} from './metric-chart'
import { ViewToggle } from './metric-controls'

export type { SeriesPoint, MetricSeries, MetricAccent, ChartView }

export type CardSize = 'sm' | 'md' | 'lg'

export interface ProgressMetricCardProps {
  title: string
  total?: string | number
  suffix?: string
  delta?: string
  deltaLabel?: string
  percent?: string
  trend?: 'up' | 'down'
  unit?: string
  defaultView?: ChartView
  accent?: MetricAccent
  data?: SeriesPoint[]
  series?: MetricSeries[]
  defaultIndex?: number
  size?: CardSize
  showStats?: boolean
  valueFormatter?: (value: number) => string
  dateFormatter?: (date: string) => string
  loading?: boolean
  description?: string
  className?: string
}

const CHART_REGION_W = 58
const NEUTRAL_PCT = 0.5

const SIZES: Record<
  CardSize,
  { minH: string; pad: string; footer: string; headline: string; chartBottom: string }
> = {
  sm: {
    minH: 'min-h-[272px] sm:min-h-[310px]',
    pad: 'px-5 pt-5 sm:px-6',
    footer: 'px-5 py-3 sm:px-6',
    headline: 'text-[48px] sm:text-[56px]',
    chartBottom: '112px',
  },
  md: {
    minH: 'min-h-[380px]',
    pad: 'px-8 pt-7',
    footer: 'px-8 py-4',
    headline: 'text-[72px]',
    chartBottom: '53px',
  },
  lg: {
    minH: 'min-h-[460px]',
    pad: 'px-10 pt-9',
    footer: 'px-10 py-5',
    headline: 'text-[88px]',
    chartBottom: '61px',
  },
}

function CountUp({
  value,
  suffix = '',
  active,
  duration = 1.6,
}: {
  value: number
  suffix?: string
  active: boolean
  duration?: number
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, duration])

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export default function ProgressMetricCard({
  title,
  total,
  suffix,
  delta,
  deltaLabel = 'today',
  percent,
  trend,
  unit,
  defaultView = 'curve',
  accent,
  data,
  series,
  defaultIndex,
  size = 'md',
  showStats = true,
  valueFormatter,
  dateFormatter,
  loading = false,
  description,
  className,
}: ProgressMetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })
  const rawId = useId().replace(/:/g, '')
  const gridId = `metric-grid-${rawId}`
  const sz = SIZES[size]

  const [view, setView] = useState<ChartView>(defaultView)

  const baseSeries: MetricSeries[] = useMemo(
    () => (series?.length ? series : [{ name: title, data: data ?? [], accent }]),
    [series, data, title, accent],
  )

  const visibleSeries = baseSeries

  const primary = visibleSeries[0]
  const isMulti = visibleSeries.length > 1
  const hasData = (primary?.data.length ?? 0) >= 2

  const stats = useMemo(() => {
    const values = primary?.data.map((point) => point.value) ?? []
    const sum = values.reduce((a, b) => a + b, 0)
    const first = values[0] ?? 0
    const last = values[values.length - 1] ?? 0
    const prev = values[values.length - 2] ?? first
    const net = last - first
    return {
      sum,
      net,
      pct: first ? (net / first) * 100 : 0,
      step: last - prev,
      peak: values.length ? Math.max(...values) : 0,
      low: values.length ? Math.min(...values) : 0,
      avg: values.length ? sum / values.length : 0,
    }
  }, [primary])

  const resolvedTrend: 'up' | 'down' | 'flat' =
    trend ?? (Math.abs(stats.pct) < NEUTRAL_PCT ? 'flat' : stats.net >= 0 ? 'up' : 'down')
  const resolvedAccent: MetricAccent =
    accent ??
    (resolvedTrend === 'down' ? 'rose' : resolvedTrend === 'up' ? 'orange' : 'neutral')
  const color = ACCENTS[resolvedAccent]
  const TrendIcon = resolvedTrend === 'flat' ? ArrowRight : resolvedTrend === 'down' ? ArrowDown : ArrowUp

  const fmtCompact = valueFormatter ?? formatCompact
  const fmtFull = valueFormatter ?? ((n: number) => n.toLocaleString() + (unit ? ` ${unit}` : ''))
  const fmtDate = dateFormatter ?? ((d: string) => d)
  const sign = (n: number) => (n >= 0 ? '+' : '−') + fmtCompact(Math.abs(n))

  const displayDelta = delta ?? sign(stats.step)
  const displayPercent = percent ?? `${Math.abs(stats.pct).toFixed(1)}%`

  const chartSeries: ChartSeries[] = visibleSeries.map((item, index) => ({
    name: item.name,
    data: item.data,
    color: item.accent
      ? ACCENTS[item.accent].stroke
      : isMulti
        ? SERIES_COLORS[index % SERIES_COLORS.length]
        : color.stroke,
  }))

  const lastIndex = (primary?.data.length ?? 1) - 1
  const fallback = Math.min(defaultIndex ?? lastIndex, Math.max(lastIndex, 0))

  const shell = cn(
    'group relative flex w-full flex-col overflow-hidden rounded-[28px] border border-[#141414]/[0.10] bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(20,20,20,0.12)] transition-colors duration-300 hover:border-[#141414]/[0.18]',
    sz.minH,
    className,
  )

  if (loading) {
    return (
      <div className={shell} aria-busy="true">
        <div className={cn('flex flex-1 flex-col', sz.pad)}>
          <div className="h-3 w-28 animate-pulse rounded bg-[#141414]/[0.08]" />
          <div className="mt-auto mb-4 h-12 w-36 animate-pulse rounded-lg bg-[#141414]/[0.08]" />
        </div>
        <div className={cn('border-t border-[#141414]/[0.08]', sz.footer)}>
          <div className="h-3 w-32 animate-pulse rounded bg-[#141414]/[0.08]" />
        </div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className={shell}>
        <div className={cn('flex flex-1 flex-col', sz.pad)}>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C5A55]">
            {title}
          </h3>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center">
            <p className="text-sm font-medium text-[#141414]">No data yet</p>
            <p className="text-xs text-[#5C5A55]">Metrics will appear once data is available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={cardRef} className={shell}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
      />

      {/* Chart region */}
      <div
        className="absolute right-0 z-0"
        style={{ width: `${CHART_REGION_W}%`, top: '10px', bottom: sz.chartBottom }}
      >
        {/* Tint + dot grid fade in from the left and out toward the bottom */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 42%)',
            maskImage: 'linear-gradient(to right, transparent, black 42%)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 94%)',
              maskImage: 'linear-gradient(to bottom, black 10%, transparent 94%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to left, ${color.stroke}14, transparent 78%)` }}
            />
            <div className="absolute inset-0 text-[#141414]/[0.12]">
              <svg className="h-full w-full" aria-hidden="true">
                <defs>
                  <pattern id={gridId} width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${gridId})`} />
              </svg>
            </div>
          </div>
        </div>

        <MetricChart
          series={chartSeries}
          view={view}
          defaultIndex={fallback}
          valueFormatter={fmtFull}
          dateFormatter={fmtDate}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          'pointer-events-none relative z-10 flex flex-1 flex-col pb-4',
          sz.pad,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[11px] font-semibold uppercase leading-5 tracking-[0.22em] text-[#5C5A55]">
            {title}
          </h3>
          <ViewToggle value={view} onChange={setView} />
        </div>

        {isMulti && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {chartSeries.map((item) => (
              <span
                key={item.name}
                className="flex items-center gap-1.5 text-[11px] text-[#5C5A55]"
              >
                <span className="size-1.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <span
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: color.text }}
          >
            <TrendIcon size={15} strokeWidth={2.5} aria-hidden="true" />
            {displayPercent}
          </span>
          <div className="flex items-end gap-2.5">
            <div
              className={cn(
                'font-medium leading-none tracking-[-0.05em] text-[#141414]',
                sz.headline,
              )}
            >
              {typeof total === 'number' ? (
                <CountUp value={total} suffix={suffix} active={inView} />
              ) : (
                (total ?? fmtCompact(stats.sum))
              )}
            </div>
          </div>
          {description && (
            <p className="mt-2 max-w-[18rem] text-sm leading-snug text-[#5C5A55]">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          'relative z-10 flex items-center justify-between gap-3 border-t border-[#141414]/[0.08] bg-[#F6F5F0]/75 backdrop-blur-md',
          sz.footer,
        )}
      >
        <div className="min-w-0 text-sm">
          <span className="font-medium" style={{ color: color.text }}>
            {displayDelta}
          </span>{' '}
          <span className="text-xs text-[#5C5A55]">{deltaLabel}</span>
        </div>
        {showStats && size !== 'sm' ? (
          <div className="flex items-center gap-2 text-[11px] text-[#5C5A55]">
            <span>
              <span className="font-medium text-[#141414]">{fmtCompact(stats.peak)}</span> peak
            </span>
            <span className="opacity-40">·</span>
            <span>
              <span className="font-medium text-[#141414]">{fmtCompact(stats.low)}</span> low
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
