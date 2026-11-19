"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BlurRevealTitleProps extends HTMLMotionProps<"h2"> {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  delay?: number;
  duration?: number;
}

export function BlurRevealTitle({
  children,
  className,
  as = "h2",
  delay = 0,
  duration = 0.8,
  ...props
}: BlurRevealTitleProps) {
  const Component = motion[as] || motion.h2;

  return (
    <Component
      initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
