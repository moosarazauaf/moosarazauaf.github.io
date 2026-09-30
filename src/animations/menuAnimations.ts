import { gsap } from "gsap";

/** Opens the menu: the panel wipes down from the top, then the items rise in
 *  one after another. Returns the timeline so closing can reverse it. */
export function menuTimeline(root: HTMLElement, reduced: boolean) {
  const panel = root.querySelector(".menu-panel");
  const items = root.querySelectorAll(".menu-item .wi");
  const meta = root.querySelectorAll("[data-menu-meta]");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  if (reduced) {
    tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.236 });
    return tl;
  }
  tl.set(root, { autoAlpha: 1 })
    .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" })
    .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.0618 }, 0.382)
    .fromTo(meta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.0618 }, 0.618);
  return tl;
}
