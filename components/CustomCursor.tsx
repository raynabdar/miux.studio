'use client'

import { useEffect, useRef, useState } from 'react'
import FluidGlass from '@/components/FluidGlass'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detects pointer capability after hydration
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    let revealed = false

    const onPointerMove = (event: PointerEvent) => {
      if (!revealed) {
        revealed = true
        setActive(true)
      }
      const dot = dotRef.current
      if (!dot) return
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      dot.style.opacity = '1'
      const target = event.target as HTMLElement | null
      dot.dataset.state = target?.closest('a, button, summary, [role="button"]')
        ? 'active'
        : 'idle'
    }

    const onPointerLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      setActive(false)
      revealed = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[9998] hidden transition-opacity duration-300 md:block ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FluidGlass
          text=""
          background="transparent"
          shape="blob"
          size={76}
          refraction={0.35}
          dispersion={0.4}
          reflection={1.25}
          color="#9c4444"
          tint={0.3}
          shadow={0.55}
          elevation={0.4}
          interaction="follow"
          smoothness={0.7}
          wobble={0.65}
          spin={-0.2}
          idle={false}
          morphOnClick={false}
          intro={false}
          className="pointer-events-none"
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden size-2 -ml-1 -mt-1 rounded-full bg-[#141414] opacity-0 transition-[width,height,margin,opacity,background-color] duration-200 data-[state=active]:size-3 data-[state=active]:-ml-1.5 data-[state=active]:-mt-1.5 data-[state=active]:bg-orange-600 md:block"
      />
    </>
  )
}
