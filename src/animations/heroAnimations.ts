import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The opening, about 2.6 seconds end to end:
 *   0.0 background · 0.2 metadata · 0.5 MUHAMMAD · 0.65 MOOSA · 0.8 RAZA
 *   1.1 Earth turns · 1.3 satellite · 1.6 "drag to explore"
 * The globe and satellite fade in through the scene frame; `onEarth` lets
 * the caller release them at the right beat.
 */
export function heroIntro(root: HTMLElement, onEarth: () => void, onSatellite: () => void) {
  const q = gsap.utils.selector(root);
  const lines = q(".hero-name .split-line .wi");
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.382 } });
  tl.set(root, { autoAlpha: 1 })
    .fromTo(q("[data-intro='meta']"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.0618 }, 0.2)
    .fromTo(lines[0] ?? [], { yPercent: 110 }, { yPercent: 0 }, 0.5)
    .fromTo(lines[1] ?? [], { yPercent: 110 }, { yPercent: 0 }, 0.65)
    .fromTo(lines[2] ?? [], { yPercent: 110 }, { yPercent: 0 }, 0.8)
    .call(onEarth, [], 1.1)
    .call(onSatellite, [], 1.3)
    .fromTo(q("[data-intro='late']"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.0618 }, 1.6);
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
