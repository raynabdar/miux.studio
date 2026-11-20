import type Lenis from "lenis";

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Scrolls to the top through Lenis when it is running, otherwise natively. */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, 0);
    return;
  }
  if (instance) {
    instance.scrollTo(0, { duration: 1.1 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Pauses wheel/touch scrolling (e.g. while a modal or the mobile menu is open). */
export function setSmoothScrollEnabled(enabled: boolean) {
  if (typeof document === "undefined") return;
  if (enabled) {
    instance?.start();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    return;
  }
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

