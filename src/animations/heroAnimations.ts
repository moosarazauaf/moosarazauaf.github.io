import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The opening. Everything a reader needs is on screen within half a second;
 * the motion is a settle, not a wait:
 *   0.0 metadata and name · 0.15 the idea, the numbers and the invitation
 *   0.2 Earth · 0.4 satellite
 * The globe and satellite fade in through the scene frame; `onEarth` lets
 * the caller release them at the right beat.
 */
export function heroIntro(root: HTMLElement, onEarth: () => void, onSatellite: () => void) {
  const q = gsap.utils.selector(root);
  const lines = q(".hero-name .split-line").map((l) => l.querySelectorAll(".wi"));
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.9 } });
  tl.set(root, { autoAlpha: 1 })
    .fromTo(q("[data-intro='meta']"), { opacity: 0.4, y: 12 }, { opacity: 1, y: 0 }, 0)
    .fromTo(lines[0] ?? [], { yPercent: 38.2, y: 0 }, { yPercent: 0, y: 0 }, 0)
    .fromTo(lines[1] ?? [], { yPercent: 38.2, y: 0 }, { yPercent: 0, y: 0 }, 0.05)
    .fromTo(lines[2] ?? [], { yPercent: 38.2, y: 0 }, { yPercent: 0, y: 0 }, 0.1)
    .fromTo(q("[data-intro='late']"), { opacity: 0.4, y: 12 }, { opacity: 1, y: 0 }, 0.15)
    .call(onEarth, [], 0.2)
    .call(onSatellite, [], 0.4);
  return tl;
}

/** As the hero scrolls away the name lifts and thins, clearing the way for
 *  the research title that replaces it. */
export function heroExit(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.618 },
  });
  tl.to(q(".hero-name"), { yPercent: -38.2, opacity: 0, ease: "none" }, 0)
    .to(q(".hero-side"), { y: -120, opacity: 0, ease: "none" }, 0)
    .to(q(".hero-cue"), { opacity: 0, ease: "none", duration: 0.236 }, 0);
  return tl;
}
