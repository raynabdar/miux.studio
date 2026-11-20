'use client'

import { useId, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export type SeriesPoint = { value: number; date: string }
export type MetricAccent = 'orange' | 'emerald' | 'rose' | 'neutral'
export type MetricSeries = { name: string; data: SeriesPoint[]; accent?: MetricAccent }
export type ChartView = 'curve' | 'bars'
export type ChartSeries = { name: string; data: SeriesPoint[]; color: string }

export const ACCENTS: Record<MetricAccent, { stroke: string; text: string }> = {
  orange: { stroke: '#EA580C', text: '#EA580C' },
  emerald: { stroke: '#059669', text: '#059669' },
  rose: { stroke: '#E11D48', text: '#E11D48' },
  neutral: { stroke: '#5C5A55', text: '#2E2D2A' },
}

export const SERIES_COLORS = ['#F97316', '#FBBF24', '#A3A3A3']

export function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return `${Math.round(value)}`
}

type XY = { x: number; y: number }

const VIEW_W = 320
const VIEW_H = 180
const PAD_Y = 18
const X_MAX = VIEW_W - 12

function smoothPath(points: XY[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 7
    const cp1y = p1.y + (p2.y - p0.y) / 7
    const cp2x = p2.x - (p3.x - p1.x) / 7
    const cp2y = p2.y - (p3.y - p1.y) / 7
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export interface MetricChartProps {
  series: ChartSeries[]
  view: ChartView
  defaultIndex?: number
  valueFormatter: (value: number) => string
  dateFormatter: (date: string) => string
  className?: string
}

export function MetricChart({
  series,
  view,
  defaultIndex = 0,
  valueFormatter,
  dateFormatter,
  className,
}: MetricChartProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, margin: '0px' })
  const [hover, setHover] = useState<number | null>(null)
  const rawId = useId().replace(/:/g, '')
  const fillId = `metric-fill-${rawId}`

  const primary = series[0]
  const data = useMemo(() => primary?.data ?? [], [primary])
  const n = data.length

  const geometry = useMemo(() => {
    const values = data.map((point) => point.value)
    const min = values.length ? Math.min(...values) : 0
    const max = values.length ? Math.max(...values) : 1
    const span = max - min || 1
    const xOf = (index: number) => (n > 1 ? (index / (n - 1)) * X_MAX : X_MAX / 2)
    const yOf = (value: number) => VIEW_H - PAD_Y - ((value - min) / span) * (VIEW_H - PAD_Y * 2)
    return { points: values.map((value, index) => ({ x: xOf(index), y: yOf(value) })), yOf }
  }, [data, n])

  const { points, yOf } = geometry
  const active = hover
  const hoverPoint = active !== null ? points[active] : null
  const hoverData = active !== null ? data[active] : null
  const emphasis = points[Math.min(Math.max(defaultIndex, 0), Math.max(n - 1, 0))]
  const animationKey = `${view}-${n}-${data.map((point) => point.value).join('-')}`

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (n < 2) return
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    setHover(Math.round(fraction * (n - 1)))
  }

  const slot = VIEW_W / Math.max(n, 1)
  const barWidth = Math.max(slot - 7, 2)
  const tooltipLeft =
    hoverPoint === null ? 50 : Math.min(Math.max((hoverPoint.x / VIEW_W) * 100, 14), 86)

  return (
    <div
      ref={rootRef}
      className={cn('relative h-full w-full', className)}
      onPointerMove={handleMove}
      onPointerLeave={() => setHover(null)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={`${primary?.name ?? 'Metric'} trend chart`}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary?.color ?? ACCENTS.orange.stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={primary?.color ?? ACCENTS.orange.stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        {view === 'curve'
          ? series.map((item, seriesIndex) => {
              const itemPoints = item.data.map((point, index) => ({
                x: n > 1 ? (index / (n - 1)) * X_MAX : X_MAX / 2,
                y: yOf(point.value),
              }))
              if (itemPoints.length === 0) return null
              const line = smoothPath(itemPoints)
              const area = `${line} L ${itemPoints[itemPoints.length - 1].x} ${VIEW_H} L ${itemPoints[0].x} ${VIEW_H} Z`
              return (
                <g key={`${item.name}-${item.color}`}>
                  {seriesIndex === 0 && (
                    <motion.path
                      key={`area-${animationKey}`}
                      d={area}
                      fill={`url(#${fillId})`}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
                    />
                  )}
                  <motion.path
                    key={`line-${animationKey}-${seriesIndex}`}
                    d={line}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{
                      pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: seriesIndex * 0.08 },
                      opacity: { duration: 0.3, delay: seriesIndex * 0.08 },
                    }}
                  />
                </g>
              )
            })
          : data.map((point, index) => {
              const height = Math.max(VIEW_H - yOf(point.value), 2)
              return (
                <motion.rect
                  key={`bar-${animationKey}-${index}`}
                  x={index * slot + (slot - barWidth) / 2}
                  y={VIEW_H - height}
                  width={barWidth}
                  height={height}
                  rx="3"
                  fill={primary?.color ?? ACCENTS.orange.stroke}
                  fillOpacity={active === null || active === index ? 0.9 : 0.45}
                  style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={inView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.05 + index * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )
            })}
      </svg>

      {!hoverPoint && emphasis && n > 1 && (
        <div
          className="pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/90"
          style={{
            left: `${(emphasis.x / VIEW_W) * 100}%`,
            top: `${(emphasis.y / VIEW_H) * 100}%`,
            background: primary?.color ?? ACCENTS.orange.stroke,
          }}
        />
      )}

      {hoverPoint && hoverData && (
        <>
          <div
            className="pointer-events-none absolute inset-y-4 w-px bg-[#141414]/20"
            style={{ left: `${(hoverPoint.x / VIEW_W) * 100}%` }}
          />
          <div
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F6F5F0]"
            style={{
              left: `${(hoverPoint.x / VIEW_W) * 100}%`,
              top: `${(hoverPoint.y / VIEW_H) * 100}%`,
              background: primary?.color ?? ACCENTS.orange.stroke,
            }}
          />
          <div
            className="pointer-events-none absolute bottom-3 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#141414]/[0.12] bg-white/95 px-2.5 py-1.5 text-[10px] shadow-xl backdrop-blur-md"
            style={{ left: `${tooltipLeft}%` }}
          >
            <p className="text-[#5C5A55]">{dateFormatter(hoverData.date)}</p>
            <p className="mt-0.5 font-medium text-[#141414]">{valueFormatter(hoverData.value)}</p>
          </div>
        </>
      )}
    </div>
  )
}
