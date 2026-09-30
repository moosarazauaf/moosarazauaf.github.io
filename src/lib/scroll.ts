import type Lenis from "lenis";

/** The one Lenis instance, if smooth scrolling is on. Kept outside React so
 *  the menu, links and overlays can scroll or lock the page without props. */
let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { immediate, duration: 1.618, offset: 0 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: immediate ? "auto" : "smooth" });
  } else {
    el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}

/** Stop the page scrolling under an overlay, and give the position back after. */
export function lockScroll(lock: boolean) {
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-locked", lock);
}
