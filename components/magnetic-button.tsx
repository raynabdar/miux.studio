'use client'

import { useRef, useState, useEffect, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  'aria-label'?: string
  title?: string
  rel?: string
  target?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
  'aria-label': ariaLabel,
  title,
  rel,
  target,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [canHover, setCanHover] = useState(false)

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setCanHover(isFinePointer && !isReduced)
  }, [])

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!canHover || !buttonRef.current || disabled) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = (e.clientX - centerX) * 0.28
    const distanceY = (e.clientY - centerY) * 0.28
    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const baseClasses = `group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50 select-none ${
    variant === 'primary'
      ? 'bg-white text-[#141414] hover:bg-white/95'
      : 'border border-white/[0.12] bg-[#141414] text-white hover:border-white/30 hover:bg-white/[0.04]'
  } ${className}`

  if (href) {
    return (
      <motion.a
        ref={buttonRef}
        href={href}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        className={baseClasses}
        aria-label={ariaLabel}
        title={title}
        rel={rel}
        target={target}
      >
        {/* Sliding fill on hover */}
        {variant === 'primary' && (
          <span className="absolute inset-0 z-0 bg-white/20 transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-1.5">
          {children}
        </span>
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className={baseClasses}
      aria-label={ariaLabel}
      title={title}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 z-0 bg-white/20 transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </motion.button>
  )
}
