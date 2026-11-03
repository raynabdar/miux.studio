'use client'

import { useEffect, useState, useRef } from 'react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only on desktop fine pointer and when reduced-motion is not requested
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!finePointer || reducedMotion) return
    setEnabled(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }

      const target = e.target as HTMLElement | null
      if (
        target &&
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-expand]'
        )
      ) {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    let animationFrameId: number
    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }
      animationFrameId = requestAnimationFrame(animateRing)
    }
    animationFrameId = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Center Dot */}
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 size-2 rounded-full bg-white transition-opacity duration-200"
        style={{
          willChange: 'transform',
          opacity: hovered ? 0 : 0.85,
        }}
      />
      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className={`absolute rounded-full border border-white/50 transition-[width,height,margin,background-color,border-color] duration-200 ease-out ${
          hovered
            ? '-left-6 -top-6 size-12 border-white/80 bg-white/10 backdrop-blur-[1px]'
            : clicked
              ? '-left-3 -top-3 size-6 border-white bg-white/20'
              : '-left-4 -top-4 size-8 border-white/40 bg-transparent'
        }`}
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  )
}
