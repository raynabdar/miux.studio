"use client";

import * as React from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Per-character reveal for a headline. Characters are split into word
 * wrappers so lines still break between words, never inside one.
 * The caller owns the accessible text; everything here is presentational.
 */
export function TypedChars({
  text,
  delay = 0,
  stagger = 0.024,
  animate = true,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  animate?: boolean;
}) {
  if (!animate) return <>{text}</>;

  let index = 0;
  return (
    <>
      {text.split(" ").map((word, wordIndex, words) => (
        <React.Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const at = delay + index * stagger;
              index += 1;
              return (
                <span
                  key={`${char}-${index}`}
                  className="inline-block"
                  style={{
                    animation: `hero-char-in 0.55s ${EASE} ${at.toFixed(3)}s both`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
}

/** Word-by-word blur rise for secondary copy. Keeps the text selectable. */
export function WordStagger({
  text,
  delay = 0,
  stagger = 0.03,
  animate = true,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  animate?: boolean;
}) {
  if (!animate) return <>{text}</>;

  return (
    <>
      {text.split(" ").map((word, index, words) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            className="inline-block"
            style={{
              animation: `hero-word-in 0.5s ${EASE} ${(delay + index * stagger).toFixed(3)}s both`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
}

export type TypewriterSegment = { text: string; className?: string };

/**
 * Character-stream typewriter over styled segments. Full text is reserved in
 * an invisible span so the line never reflows while it types.
 */
export function TypewriterSegments({
  segments,
  startDelayMs = 120,
  charSpeedMs = 24,
  animate = true,
  className,
}: {
  segments: TypewriterSegment[];
  startDelayMs?: number;
  charSpeedMs?: number;
  animate?: boolean;
  className?: string;
}) {
  const full = React.useMemo(
    () => segments.map((segment) => segment.text).join(""),
    [segments],
  );
  const runKey = `${animate ? 1 : 0}:${full}`;
  const [progress, setProgress] = React.useState({ key: "", count: 0 });
  const typedCount = progress.key === runKey ? progress.count : 0;
  const visible = animate ? Math.min(typedCount, full.length) : full.length;

  React.useEffect(() => {
    if (!animate) return;

    let index = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setProgress({ key: runKey, count: index });
        if (index >= full.length && interval) window.clearInterval(interval);
      }, charSpeedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [animate, full, runKey, startDelayMs, charSpeedMs]);

  const typed = segments.map((segment, index) => {
    const offset = segments
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.text.length, 0);
    return {
      key: index,
      className: segment.className,
      text: segment.text.slice(
        0,
        Math.max(0, Math.min(segment.text.length, visible - offset)),
      ),
    };
  });
  const done = visible >= full.length;

  return (
    <span className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {typed.map((segment) =>
          segment.text ? (
            <span key={segment.key} className={segment.className}>
              {segment.text}
            </span>
          ) : null,
        )}
        {!done && (
          <span
            className="ml-[1px] inline-block h-[0.85em] w-[1.5px] translate-y-[0.1em] bg-orange-400 align-baseline"
            style={{ animation: "hero-caret 0.55s linear infinite" }}
          />
        )}
        <span className="pointer-events-none select-none opacity-0">
          {full.slice(visible)}
        </span>
      </span>
    </span>
  );
}
