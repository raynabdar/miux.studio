'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
}

export function HeroMedia() {
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
    const slow =
      connection?.saveData === true ||
      ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')

    if (reduce || narrow || slow) return
    const id = requestAnimationFrame(() => setVideoReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoReady) return

    const play = () => {
      void video.play().catch(() => {})
    }

    play()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else video.pause()
      },
      { rootMargin: '200px' }
    )
    observer.observe(video)

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else play()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [videoReady])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F6F5F0]" aria-hidden="true">
      <Image
        src="/hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-[0.14] saturate-[0.75]"
      />
      {videoReady && (
        <video
          ref={videoRef}
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.14] saturate-[0.75]"
        />
      )}
    </div>
  )
}
