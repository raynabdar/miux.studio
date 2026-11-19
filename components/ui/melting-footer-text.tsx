"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const VERT_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = (aPosition + 1.0) * 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SHADER = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 diff = (uv - uMouse) * aspect;
  float dist = length(diff);

  float radius = 0.32;
  float influence = smoothstep(radius, 0.0, dist) * uHover;

  if (influence > 0.001) {
    float n1 = snoise(uv * 7.0 + vec2(0.0, uTime * 1.8));
    float n2 = snoise(uv * 14.0 - vec2(uTime * 1.4, 0.0));

    // Downward melting drip + lateral organic liquid warping
    float drip = influence * influence * 0.16 * (1.0 + 0.7 * n1);
    float warpX = sin(uv.y * 22.0 + uTime * 3.5) * influence * 0.04 * (1.0 + 0.5 * n2);
    float warpY = drip + cos(uv.x * 18.0 + uTime * 2.8) * influence * 0.025;

    uv.x -= warpX;
    uv.y -= warpY;
  }

  uv = clamp(uv, 0.0, 1.0);
  vec4 col = texture2D(uTexture, uv);

  // Subtle warm orange-tinted liquid sheen under cursor on hover over deep ink text
  if (influence > 0.02 && col.a > 0.01) {
    float rim = smoothstep(0.02, 0.28, influence) * (1.0 - smoothstep(0.28, 0.85, influence));
    col.rgb = mix(col.rgb, vec3(0.92, 0.35, 0.05), rim * 0.45);
  }

  gl_FragColor = col;
}
`;

export function MeltingFooterText({ text = "miux" }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const stateRef = useRef({
    targetMouse: { x: 0.5, y: 0.5 },
    currentMouse: { x: 0.5, y: 0.5 },
    isHovered: false,
    hover: 0,
    time: 0,
    gl: null as WebGLRenderingContext | null,
    texture: null as WebGLTexture | null,
    program: null as WebGLProgram | null,
    uResolution: null as WebGLUniformLocation | null,
    uMouse: null as WebGLUniformLocation | null,
    uHover: null as WebGLUniformLocation | null,
    uTime: null as WebGLUniformLocation | null,
    width: 0,
    height: 0,
  });

  const renderTextToTexture = useCallback((gl: WebGLRenderingContext, texture: WebGLTexture, width: number, height: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const textCanvas = document.createElement("canvas");
    textCanvas.width = Math.max(1, Math.floor(width * dpr));
    textCanvas.height = Math.max(1, Math.floor(height * dpr));
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

    // Calculate font size to fill the canvas proportionally without CSS var dependencies
    let fontSize = textCanvas.height * 0.95;
    const fontFamilies = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.font = `900 ${fontSize}px ${fontFamilies}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(text);
    if (metrics.width > textCanvas.width * 0.94) {
      fontSize *= (textCanvas.width * 0.94) / metrics.width;
      ctx.font = `900 ${fontSize}px ${fontFamilies}`;
    }

    // Deep ink wordmark (#141414) on off-white canvas
    ctx.fillStyle = "#141414";
    ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2 + textCanvas.height * 0.04);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }, [text]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERT_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    if (!texture) return;

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uHover = gl.getUniformLocation(program, "uHover");
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const state = stateRef.current;
    state.gl = gl;
    state.texture = texture;
    state.program = program;
    state.uResolution = uResolution;
    state.uMouse = uMouse;
    state.uHover = uHover;
    state.uTime = uTime;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      if (w <= 0 || h <= 0) return;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      state.width = w;
      state.height = h;

      gl.viewport(0, 0, canvas.width, canvas.height);
      renderTextToTexture(gl, texture, w, h);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Re-draw once fonts are loaded to guarantee crisp rendering
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (state.gl && state.texture && state.width > 0 && state.height > 0) {
          renderTextToTexture(state.gl, state.texture, state.width, state.height);
        }
      });
    }

    let lastTimestamp = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      state.currentMouse.x += (state.targetMouse.x - state.currentMouse.x) * 0.12;
      state.currentMouse.y += (state.targetMouse.y - state.currentMouse.y) * 0.12;

      const targetHover = state.isHovered ? 1.0 : 0.0;
      state.hover += (targetHover - state.hover) * 0.08;

      state.time += dt;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, state.currentMouse.x, state.currentMouse.y);
      gl.uniform1f(uHover, state.hover);
      gl.uniform1f(uTime, state.time);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let frameHandle = 0;
    let visible = true;

    const tick = (now: number) => {
      draw(now);
      frameHandle = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameHandle || !visible || reduceMotion) return;
      frameHandle = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameHandle) cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    };

    if (reduceMotion) {
      draw(performance.now());
    } else {
      start();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "150px" }
    );
    observer.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      state.targetMouse.x = (e.clientX - rect.left) / rect.width;
      state.targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    const onMouseEnter = (e: MouseEvent) => {
      state.isHovered = true;
      const rect = container.getBoundingClientRect();
      state.targetMouse.x = (e.clientX - rect.left) / rect.width;
      state.targetMouse.y = (e.clientY - rect.top) / rect.height;
      state.currentMouse.x = state.targetMouse.x;
      state.currentMouse.y = state.targetMouse.y;
    };

    const onMouseLeave = () => {
      state.isHovered = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [renderTextToTexture]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[24vw] min-h-[180px] max-h-[380px] select-none overflow-hidden cursor-pointer bg-[#F6F5F0]"
    >
      <span className="sr-only">{text}</span>
      {/* Background matching off-white base colour (#F6F5F0) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#F6F5F0]"
      />

      {webglSupported ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      ) : (
        <p
          className="whitespace-nowrap text-center text-[28vw] font-bold leading-[0.68] tracking-[-0.08em] text-[#141414]"
        >
          {text}
        </p>
      )}

      {/* Off-white fog overlay over bottom edge of wordmark with 85% fog strength */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#F6F5F0] via-[#F6F5F0]/85 to-transparent z-10"
      />
    </div>
  );
}
