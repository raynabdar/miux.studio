"use client";

import React, { ElementType } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineAnimationProps<T extends ElementType = "div"> {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  as?: T;
  customVariants?: Variants;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: number | "some" | "all";
  };
  [key: string]: any;
}

export function TimelineContent<T extends ElementType = "div">({
  children,
  animationNum = 0,
  timelineRef,
  className,
  as,
  customVariants,
  viewport = { once: true, margin: "0px 0px -50px 0px" },
  ...props
}: TimelineAnimationProps<T>) {
  const localRef = React.useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || localRef;
  const isInView = useInView(targetRef, {
    once: viewport?.once ?? true,
    margin: (viewport?.margin as any) ?? "0px 0px -50px 0px",
  });

  const Component = motion.create(as || "div");

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <Component
      ref={timelineRef ? undefined : localRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={customVariants || defaultVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export const TimelineAnimation = TimelineContent;
