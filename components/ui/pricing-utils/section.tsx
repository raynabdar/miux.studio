import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className, id = "pricing", ...props }: SectionProps) {
  return (
    <section
      id={id}
      aria-label="Pricing and engagement tiers"
      className={cn("px-5 py-24 sm:py-32 bg-[#141414] text-white", className)}
      {...props}
    >
      {children}
    </section>
  );
}
