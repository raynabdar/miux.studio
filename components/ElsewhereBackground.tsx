"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

export interface ElsewhereBackgroundProps {
  daySrc: string;
  nightSrc: string;
  isNight?: boolean;
  objectPosition?: string;
  className?: string;
  style?: CSSProperties;
}

export default function ElsewhereBackground({
  daySrc,
  nightSrc,
  isNight = false,
  objectPosition = "42% 50%",
  className,
  style,
}: ElsewhereBackgroundProps) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  // Nothing is mounted during SSR: isNight is only known after hydration, so
  // mounting the day clip up front made night visitors download both clips.
  // After mount only the active clip exists; on toggle the new clip fades in
  // over the old one, which unmounts once the cross-fade has finished.
  const [clips, setClips] = useState({ day: false, night: false });
  useEffect(() => {
    const active = isNight ? "night" : "day";
    // isNight is resolved by a post-hydration effect, so mounting the clip in
    // this same commit would start the day clip for night visitors. One delay
    // later the value has settled; the last run wins.
    let settle: ReturnType<typeof setTimeout> | undefined;
    const start = setTimeout(() => {
      setClips((c) => (c[active] ? c : { ...c, [active]: true }));
      settle = setTimeout(
        () => setClips({ day: active === "day", night: active === "night" }),
        2600,
      );
    }, 250);
    return () => {
      clearTimeout(start);
      clearTimeout(settle);
    };
  }, [isNight]);

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a0d08",
        ...style,
      }}
    >
      {/* Poster paints immediately, before either clip decodes */}
      <Image
        src="/hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition,
        }}
      />
      {!reduced && clips.day && (
        <video
          src={daySrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          style={{ ...videoStyle, objectPosition, opacity: isNight ? 0 : 1 }}
        />
      )}
      {!reduced && clips.night && (
        <video
          src={nightSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          style={{ ...videoStyle, objectPosition, opacity: isNight ? 1 : 0 }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.14) 32%, rgba(0,0,0,0) 58%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

const videoStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  willChange: "opacity",
  transition: "opacity 2.4s cubic-bezier(0.22, 1, 0.36, 1)",
};
