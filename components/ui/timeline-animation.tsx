"use client";

import React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const MOTION_COMPONENTS = {
  div: motion.div,
  p: motion.p,
  span: motion.span,
  section: motion.section,
  article: motion.article,
} as const;

type MotionTag = keyof typeof MOTION_COMPONENTS;

export interface TimelineAnimationProps {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  as?: MotionTag;
  customVariants?: Variants;
}

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef,
  className,
  as = "div",
  customVariants,
}: TimelineAnimationProps) {
  const localRef = React.useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || localRef;
  const isInView = useInView(targetRef, {
    once: true,
    margin: "0px 0px -50px 0px",
  });

  const Component = MOTION_COMPONENTS[as];

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
    >
      {children}
    </Component>
  );
}

export const TimelineAnimation = TimelineContent;
