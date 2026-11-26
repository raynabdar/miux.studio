import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BookACallButtonProps {
  label?: string;
  href?: string;
  onBookCall?: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

/**
 * Orange booking CTA used across the site. Kept as its own component so the
 * hero action, pricing and closing CTA can share one shape.
 */
export function BookACallButton({
  label = "Book a 45-min call",
  href = "/meeting",
  onBookCall,
  className,
  ariaLabel,
  title,
}: BookACallButtonProps) {
  return (
    <Link
      href={href}
      onClick={onBookCall}
      title={title ?? label}
      aria-label={ariaLabel ?? label}
      className={cn(
        "group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#F97316] px-7 text-[15px] font-semibold tracking-[-0.01em] text-[#141414] select-none",
        "ring-1 ring-inset ring-white/35",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_6px_rgba(154,52,0,0.22),0_18px_44px_-18px_rgba(249,115,22,0.65)]",
        "transition-[transform,background-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:bg-[#FB7A22] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_6px_rgba(154,52,0,0.22),0_22px_50px_-20px_rgba(249,115,22,0.75)]",
        "active:translate-y-0 active:scale-[0.99]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600",
        className,
      )}
    >
      <span>{label}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

export default BookACallButton;
