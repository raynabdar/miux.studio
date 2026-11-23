"use client";

import type { CSSProperties } from "react";

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.16) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.34))",
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
