"use client";

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

export type PrismSilkPreset = "prism" | "opal" | "ember" | "nocturne";

export type PrismSilkColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type PrismSilkSocial = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export interface PrismSilkFooterProps {
  name?: string;
  tagline?: string;
  columns?: PrismSilkColumn[];
  socials?: PrismSilkSocial[];
  copyright?: ReactNode;
  credit?: ReactNode;
  backToTop?: boolean | string;
  children?: ReactNode;
  preset?: PrismSilkPreset;
  palette?: { base?: string; inkA?: string; inkB?: string; inkC?: string };
  seed?: number;
  speed?: number;
  grain?: number;
  height?: number;
  maxWidth?: number;
  fontFamily?: string;
  className?: string;
  id?: string;
}

type Rgb = [number, number, number];

const PRESETS: Record<PrismSilkPreset, { base: Rgb; inkA: Rgb; inkB: Rgb; inkC: Rgb }> = {
  prism: {
    base: [0.965, 0.961, 0.941],
    inkA: [0.878, 0.902, 0.973],
    inkB: [0.663, 0.702, 0.855],
    inkC: [0.49, 0.827, 0.988],
  },
  opal: {
    base: [0.957, 0.98, 0.969],
    inkA: [0.851, 0.937, 0.918],
    inkB: [0.702, 0.62, 0.847],
    inkC: [0.561, 0.89, 0.784],
  },
  ember: {
    base: [0.965, 0.961, 0.941],
    inkA: [0.984, 0.929, 0.863],
    inkB: [0.851, 0.69, 0.549],
    inkC: [0.976, 0.451, 0.086],
  },
  nocturne: {
    base: [0.055, 0.063, 0.078],
    inkA: [0.106, 0.133, 0.188],
    inkB: [0.039, 0.047, 0.063],
    inkC: [0.976, 0.451, 0.086],
  },
};

function hexToRgb(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uRipple;
uniform float uSeed;
uniform float uGrain;
uniform vec3 uBase;
uniform vec3 uInkA;
uniform vec3 uInkB;
uniform vec3 uInkC;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.07;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float t = uTime;

  vec2 q = vec2(
    fbm(p * 1.7 + vec2(0.0, t * 0.11)),
    fbm(p * 1.7 + vec2(4.7, -t * 0.09))
  );
  vec2 r = p + (q - 0.5) * 0.62;

  float fold = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float ang = 0.5 + fi * 0.83;
    vec2 dir = vec2(cos(ang), sin(ang));
    fold += sin(dot(r, dir) * (4.2 + fi * 1.6) + t * (0.5 + fi * 0.22) + fi * 2.3) * (0.5 - fi * 0.07);
  }
  fold = clamp(fold * 0.58 + 0.5, 0.0, 1.0);

  float crest = smoothstep(0.6, 0.98, fold);
  float valley = smoothstep(0.4, 0.0, fold);
  float wash = smoothstep(0.15, 0.9, fbm(r * 2.2 + t * 0.07));

  vec3 col = uBase;
  col = mix(col, uInkA, wash * 0.5);
  col = mix(col, uInkB, valley * 0.46);
  col = mix(col, uInkC, crest * 0.34);
  col += uInkC * smoothstep(0.72, 0.99, fold) * 0.16;

  // Pointer bloom
  vec2 ptr = vec2(uPointer.x * aspect, uPointer.y);
  float pd = length(p - (ptr - vec2(0.5 * aspect, 0.5)));
  col += uInkC * smoothstep(0.85, 0.0, pd) * 0.09;

  // Click ripple ring
  if (uRipple.z > -0.5) {
    float age = max(uTime - uRipple.z, 0.0);
    vec2 rp = vec2(uRipple.x * aspect, uRipple.y);
    float rd = length(p - (rp - vec2(0.5 * aspect, 0.5)));
    float ring = exp(-pow((rd - age * 0.55) / 0.055, 2.0)) * max(0.0, 1.0 - age * 0.7);
    col += uInkC * ring * 0.22;
  }

  // Paper vignette keeps edges calm
  float vig = smoothstep(1.25, 0.3, length(p * vec2(0.82, 1.3)));
  col = mix(uBase, col, mix(0.42, 1.0, vig));

  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * uGrain;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

function PrismSilkCanvas({
  reduced,
  preset,
  palette,
  seed,
  speed,
  grain,
  revealed,
}: {
  reduced: boolean;
  preset: PrismSilkPreset;
  palette?: PrismSilkFooterProps["palette"];
  seed: number;
  speed: number;
  grain: number;
  revealed: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uPointer = u("uPointer");
    const uRipple = u("uRipple");
    const uSeed = u("uSeed");
    const uGrain = u("uGrain");

    const colors = PRESETS[preset];
    const parse = (value: string | undefined, fallback: Rgb): Rgb =>
      (value && hexToRgb(value)) || fallback;
    gl.uniform3fv(u("uBase"), parse(palette?.base, colors.base));
    gl.uniform3fv(u("uInkA"), parse(palette?.inkA, colors.inkA));
    gl.uniform3fv(u("uInkB"), parse(palette?.inkB, colors.inkB));
    gl.uniform3fv(u("uInkC"), parse(palette?.inkC, colors.inkC));
    gl.uniform1f(uSeed, seed);
    gl.uniform1f(uGrain, grain);

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastFrame = 0;
    let visible = true;
    let pointerX = 0.5;
    let pointerY = 0.4;
    let ripple = -1;
    const startedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
    };

    const draw = (now: number) => {
      if (!width || !height) return;
      const t = ((now - startedAt) / 1000) * speed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointerX, 1 - pointerY);
      gl.uniform3f(uRipple, pointerX, 1 - pointerY, ripple);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = window.requestAnimationFrame(frame);
      if (!visible) return;
      if (now - lastFrame < 1000 / 30) return;
      lastFrame = now;
      draw(now);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
      ripple = ((performance.now() - startedAt) / 1000) * speed;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    resize();

    if (reduced) {
      draw(startedAt + 600);
    } else {
      raf = window.requestAnimationFrame(frame);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [grain, palette, preset, reduced, seed, speed]);

  const colors = PRESETS[preset];
  const baseHex = palette?.base ?? rgbToHex(colors.base);
  const inkCHex = palette?.inkC ?? rgbToHex(colors.inkC);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 20% 10%, ${inkCHex}22, transparent 60%), radial-gradient(90% 80% at 85% 90%, ${baseHex}, ${inkCHex}1f), linear-gradient(160deg, ${baseHex} 0%, ${baseHex} 60%, ${inkCHex}14 100%)`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[2400ms] ease-out",
        revealed ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

function rgbToHex([r, g, b]: Rgb) {
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function PrismSilkFooter({
  name = "miux",
  tagline,
  columns,
  socials,
  copyright,
  credit,
  backToTop = true,
  children,
  preset = "prism",
  palette,
  seed = 11,
  speed = 1,
  grain = 0.045,
  height = 420,
  maxWidth = 1200,
  fontFamily,
  className,
  id,
}: PrismSilkFooterProps) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const colors = PRESETS[preset];
  const base = palette?.base ?? rgbToHex(colors.base);
  const hasLinks = Boolean(columns?.length || socials?.length);
  const backLabel = typeof backToTop === "string" ? backToTop : "Back to top";

  return (
    <footer
      ref={sectionRef}
      id={id}
      aria-label={`${name} closing silk panel`}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ minHeight: height, backgroundColor: base, fontFamily }}
    >
      <PrismSilkCanvas
        reduced={reduced}
        preset={preset}
        palette={palette}
        seed={seed}
        speed={speed}
        grain={grain}
        revealed={revealed}
      />

      {children ? <div className="relative z-10">{children}</div> : null}

      <div
        className="relative z-10 mx-auto flex w-full flex-col justify-end px-5 pb-6 pt-10 sm:px-8 sm:pb-8"
        style={{ maxWidth }}
      >
        {hasLinks && (
          <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns?.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#141414]/55">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <a
                        href={link.href}
                        className="rounded-sm text-sm text-[#141414]/75 transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {socials?.length ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#141414]/55">
                  Connect
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-1 -ml-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={`Follow Miux Studio on ${social.label}`}
                      title={`Miux Studio on ${social.label}`}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex size-10 items-center justify-center rounded-full text-[#141414]/65 transition-colors hover:bg-white/60 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      {social.icon ?? <span className="text-xs">{social.label}</span>}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="relative flex flex-col items-center">
          <span
            aria-hidden="true"
            className={cn(
              "select-none bg-[linear-gradient(180deg,#141414_0%,#3F2A17_52%,#C2410C_100%)] bg-clip-text text-center font-semibold leading-[0.78] tracking-[-0.06em] text-transparent transition-[opacity,transform] duration-[1800ms] ease-out",
              revealed ? "translate-y-0 opacity-95" : "translate-y-4 opacity-0",
            )}
            style={{ fontSize: "clamp(96px, 21vw, 280px)" }}
          >
            {name}
          </span>

          {tagline && (
            <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-[#141414]/60">
              {tagline}
            </p>
          )}
        </div>

        {(copyright || credit || backToTop) && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#141414]/[0.08] pt-5 text-xs text-[#141414]/60 sm:flex-row">
            <span>{copyright}</span>
            <div className="flex items-center gap-4">
              {credit}
              {backToTop && (
                <button
                  type="button"
                  onClick={() => {
                    const behavior = reduced ? "auto" : "smooth";
                    window.scrollTo({ top: 0, behavior });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#141414]/[0.12] bg-white/50 px-3.5 py-1.5 text-xs font-medium text-[#141414]/75 transition-colors hover:border-orange-500/45 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  {backLabel}
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default PrismSilkFooter;
