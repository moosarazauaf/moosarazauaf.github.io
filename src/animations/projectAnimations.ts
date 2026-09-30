import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Where the clicked image sat on screen, so the study can open out of it. */
let origin: DOMRect | null = null;
export const setFlipOrigin = (el: Element | null) => {
  origin = el ? el.getBoundingClientRect() : null;
};

/**
 * Opens a study out of the image that was clicked: the full-width image
 * starts clipped to exactly where the thumbnail was, then the clip opens to
 * fill the frame while the image settles from a slight zoom. Clipping rather
 * than scaling keeps the picture undistorted however different the two
 * shapes are.
 */
export function expandFrom(frame: HTMLElement, img: HTMLElement, rest: Element[], reduced: boolean) {
  const tl = gsap.timeline();
  if (reduced || !origin) {
    tl.fromTo([frame, ...rest], { opacity: 0 }, { opacity: 1, duration: 0.382 });
    origin = null;
    return tl;
  }
  const f = frame.getBoundingClientRect();
  const o = origin;
  origin = null;
  const top = Math.max(0, o.top - f.top);
  const left = Math.max(0, o.left - f.left);
  const right = Math.max(0, f.right - o.right);
  const bottom = Math.max(0, f.bottom - o.bottom);
  tl.fromTo(
    frame,
    { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px)` },
    { clipPath: "inset(0px 0px 0px 0px)", duration: 1.2, ease: "expo.inOut" }
  )
    .fromTo(img, { scale: 1.236 }, { scale: 1, duration: 1.618, ease: "expo.out" }, 0)
    .fromTo(rest, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.0618 }, 0.618);
  return tl;
}

/** Images drift against the scroll by a few percent, so the page has depth. */
export function parallaxImages(root: HTMLElement) {
  const tweens = [...root.querySelectorAll<HTMLElement>("[data-parallax] img")].map((img) =>
    gsap.fromTo(
      img,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      }
    )
  );
  return () =>
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
}
