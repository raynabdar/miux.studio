"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// shadcn-style primitives for using the visual as a standalone card. The site
// embeds <Visual2 /> directly inside its own stat card instead.
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

// --- Visual2: donut + orbiting service pills ---

export interface DiagramItem {
  id: number;
  translateX: string;
  translateY: string;
  text: string;
}

const DEFAULT_ITEMS: DiagramItem[] = [
  { id: 1, translateX: "100", translateY: "50", text: "ReactJS" },
  { id: 2, translateX: "100", translateY: "-50", text: "MongoDB" },
  { id: 3, translateX: "125", translateY: "0", text: "Prisma" },
  { id: 4, translateX: "-125", translateY: "0", text: "NextJs" },
  { id: 5, translateX: "-100", translateY: "50", text: "Auth.js" },
  { id: 6, translateX: "-100", translateY: "-50", text: "Stripe" },
];

interface Visual2Props {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
  label?: string;
  hint?: string;
  items?: DiagramItem[];
}

export function Visual2({
  mainColor = "#f97316",
  secondaryColor = "#ea580c",
  gridColor = "#14141412",
  label = "Random Data Visualization",
  hint = "Displaying some interesting stats.",
  items = DEFAULT_ITEMS,
}: Visual2Props) {
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
      <Layer1
        hovered={hovered}
        color={mainColor}
        secondaryColor={secondaryColor}
      />
      <Layer2 color={mainColor} label={label} hint={hint} />
      <Layer3 color={mainColor} />
      <Layer4
        color={mainColor}
        secondaryColor={secondaryColor}
        hovered={hovered}
        items={items}
      />
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
        <rect width="356" height="180" fill="url(#diagram-radial-glow)" />
        <defs>
          <radialGradient
            id="diagram-radial-glow"
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

const GridLayer: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      style={{ "--grid-color": color } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
  );
};

const Layer1: React.FC<LayerProps> = ({ hovered, color, secondaryColor }) => {
  const mainProgress = hovered ? 66 : 12.5;
  const secondaryProgress = hovered ? 100 : 0;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const mainDashoffset = circumference - (mainProgress / 100) * circumference;
  const secondaryDashoffset =
    circumference - (secondaryProgress / 100) * circumference;

  return (
    <div className="absolute top-0 left-0 z-[7] flex h-[360px] w-full transform items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:-translate-y-[90px] group-hover/animated-card:scale-110">
      <div className="relative flex h-[120px] w-[120px] items-center justify-center text-[#141414]">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              opacity={0.12}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={secondaryColor}
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={secondaryDashoffset}
              transform="rotate(-90 50 50)"
              style={{
                transition:
                  "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)",
                transitionDelay: hovered ? "200ms" : "0ms",
              }}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={mainDashoffset}
              transform="rotate(-90 50 50)"
              style={{
                transition:
                  "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-medium tabular-nums text-[#141414]">
              {hovered
                ? secondaryProgress > 66
                  ? secondaryProgress
                  : mainProgress
                : mainProgress}
              %
            </span>
          </div>
        </div>
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
      <div className="absolute inset-0 z-[6] flex w-full translate-y-0 items-start justify-center bg-transparent p-4 transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:translate-y-full">
        <div className="rounded-md border border-[#141414]/[0.10] bg-white/80 px-2 py-1.5 opacity-100 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--color)]" />
            <p className="text-xs font-medium text-[#141414]">{label}</p>
          </div>
          <p className="mt-1 text-xs text-[#5C5A55]">{hint}</p>
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
        <rect width="356" height="180" fill="url(#diagram-fade-linear)" />
        <defs>
          <linearGradient
            id="diagram-fade-linear"
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

const Layer4: React.FC<LayerProps & { items: DiagramItem[] }> = ({
  color,
  secondaryColor,
  hovered,
  items,
}) => {
  return (
    <div className="absolute inset-0 z-[7] flex items-center justify-center opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-100">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center gap-1 rounded-full border border-[#141414]/[0.10] bg-white/80 px-1.5 py-0.5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]"
          style={{
            transform: hovered
              ? `translate(${item.translateX}px, ${item.translateY}px)`
              : "translate(0px, 0px)",
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: index < 3 ? color : secondaryColor }}
          />
          <span className="text-[10px] text-[#141414]">{item.text}</span>
        </div>
      ))}
    </div>
  );
};
