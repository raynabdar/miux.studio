export function Map() {
  return (
    <div className="relative size-full" aria-hidden="true">
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        fill="none"
      >
        <defs>
          <pattern id="contact-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.1" fill="currentColor" />
          </pattern>
          <radialGradient id="contact-fade" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="contact-mask">
            <ellipse cx="500" cy="265" rx="450" ry="265" fill="url(#contact-fade)" />
          </mask>
        </defs>

        <rect
          width="1000"
          height="600"
          fill="url(#contact-grid)"
          mask="url(#contact-mask)"
          className="text-[#141414]"
        />

        <g stroke="currentColor" strokeWidth="1" className="text-[#141414]/25">
          <ellipse cx="500" cy="265" rx="190" ry="265" />
          <ellipse cx="500" cy="265" rx="335" ry="265" />
          <ellipse cx="500" cy="265" rx="450" ry="265" />
          <ellipse cx="500" cy="265" rx="450" ry="95" />
          <ellipse cx="500" cy="265" rx="450" ry="175" />
          <path d="M500 0v530" />
        </g>
      </svg>
    </div>
  );
}

export default Map;
