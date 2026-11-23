"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// shadcn-style primitives for using the visual as a standalone card. The site
// embeds <Visual3 /> directly inside its own stat card instead.
type CardProps = React.HTMLAttributes<HTMLDivElement>;
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;

export function AnimatedCard({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "group/animated-card relative w-full max-w-[356px] overflow-hidden rounded-xl border border-[#141414]/[0.10] bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 border-t border-[#141414]/[0.10] p-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-[#141414]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-sm text-[#5C5A55]", className)}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("aspect-[356/180] w-full overflow-hidden", className)}
      {...props}
    />
  );
}

// --- Visual3: bar chart that reshapes on hover ---

interface Visual3Props {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
  label?: string;
  hint?: string;
}

export function Visual3({
  mainColor = "#f97316",
  secondaryColor = "#ea580c",
  gridColor = "#14141412",
  label = "Random Data Visualization",
  hint = "Displaying some interesting stats.",
}: Visual3Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group/animated-card relative h-full w-full overflow-hidden"
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        {
          "--color": mainColor,
          "--secondary-color": secondaryColor,
        } as React.CSSProperties
      }
    >
      <Layer4 color={mainColor} secondaryColor={secondaryColor} hovered={hovered} />
      <Layer3 color={mainColor} />
      <Layer2 color={mainColor} label={label} hint={hint} />
      <Layer1 color={mainColor} secondaryColor={secondaryColor} />
      <EllipseGradient color={mainColor} />
      <GridLayer color={gridColor} />
    </div>
  );
}

interface LayerProps {
  color: string;
  secondaryColor?: string;
  hovered?: boolean;
}

const GridLayer: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      style={{ "--grid-color": color } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
  );
};

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 356 180"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#chart-radial-glow)" />
        <defs>
          <radialGradient
            id="chart-radial-glow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(178 98) rotate(90) scale(98 178)"
          >
            <stop stopColor={color} stopOpacity="0.25" />
            <stop offset="0.34" stopColor={color} stopOpacity="0.15" />
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer1: React.FC<LayerProps> = ({ color, secondaryColor }) => {
  return (
    <div
      className="absolute top-2.5 left-2.5 z-[8] flex items-center gap-1"
      style={
        {
          "--color": color,
          "--secondary-color": secondaryColor,
        } as React.CSSProperties
      }
    >
      <div className="flex shrink-0 items-center rounded-full border border-[#141414]/[0.10] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color)]" />
        <span className="ml-1 text-[10px] text-[#141414]">+15,2%</span>
      </div>
      <div className="flex shrink-0 items-center rounded-full border border-[#141414]/[0.10] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-color)]" />
        <span className="ml-1 text-[10px] text-[#141414]">+18,7%</span>
      </div>
    </div>
  );
};

const Layer2: React.FC<{ color: string; label: string; hint: string }> = ({
  color,
  label,
  hint,
}) => {
  return (
    <div
      className="relative h-full w-full"
      style={{ "--color": color } as React.CSSProperties}
    >
      <div className="absolute inset-0 z-[7] flex w-full translate-y-full items-start justify-center bg-transparent p-4 transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:translate-y-0">
        <div className="rounded-md border border-[#141414]/[0.10] bg-white/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.6,0,1,0)] group-hover/animated-card:opacity-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--color)]" />
            <p className="text-xs font-medium text-[#141414]">{label}</p>
          </div>
          <p className="mt-0.5 text-xs text-[#5C5A55]">{hint}</p>
        </div>
      </div>
    </div>
  );
};

const Layer3: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 z-[6] flex translate-y-full items-center justify-center opacity-0 transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:translate-y-0 group-hover/animated-card:opacity-100">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 356 180"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#chart-fade-linear)" />
        <defs>
          <linearGradient
            id="chart-fade-linear"
            x1="178"
            y1="0"
            x2="178"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.35" stopColor={color} stopOpacity="0" />
            <stop offset="1" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer4: React.FC<LayerProps> = ({ color, secondaryColor, hovered }) => {
  const rectsData = [
    { width: 15, height: 20, y: 110, hoverHeight: 20, hoverY: 130, x: 40, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 20, y: 90, hoverHeight: 20, hoverY: 130, x: 60, fill: color, hoverFill: color },
    { width: 15, height: 40, y: 70, hoverHeight: 30, hoverY: 120, x: 80, fill: color, hoverFill: color },
    { width: 15, height: 30, y: 80, hoverHeight: 50, hoverY: 100, x: 100, fill: color, hoverFill: color },
    { width: 15, height: 30, y: 110, hoverHeight: 40, hoverY: 110, x: 120, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 50, y: 110, hoverHeight: 20, hoverY: 130, x: 140, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 50, y: 60, hoverHeight: 30, hoverY: 120, x: 160, fill: color, hoverFill: color },
    { width: 15, height: 30, y: 80, hoverHeight: 20, hoverY: 130, x: 180, fill: color, hoverFill: color },
    { width: 15, height: 20, y: 110, hoverHeight: 40, hoverY: 110, x: 200, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 40, y: 70, hoverHeight: 60, hoverY: 90, x: 220, fill: color, hoverFill: color },
    { width: 15, height: 30, y: 110, hoverHeight: 70, hoverY: 80, x: 240, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 50, y: 110, hoverHeight: 50, hoverY: 100, x: 260, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 20, y: 110, hoverHeight: 80, hoverY: 70, x: 280, fill: "currentColor", hoverFill: secondaryColor },
    { width: 15, height: 30, y: 80, hoverHeight: 90, hoverY: 60, x: 300, fill: color, hoverFill: color },
  ];

  return (
    <div className="absolute inset-0 z-[8] flex h-full w-full items-center justify-center text-[#141414]/[0.10] transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:scale-150">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 356 180"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rectsData.map((rect, index) => (
          <rect
            key={index}
            width={rect.width}
            height={hovered ? rect.hoverHeight : rect.height}
            x={rect.x}
            y={hovered ? rect.hoverY : rect.y}
            fill={hovered ? rect.hoverFill : rect.fill}
            rx="2"
            ry="2"
            className="transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]"
          />
        ))}
      </svg>
    </div>
  );
};
