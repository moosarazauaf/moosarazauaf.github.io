import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "../lib/scroll";
import { scene } from "../three/sceneState";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scrolling that stays real scrolling: the document still scrolls, so
 * keyboard, find-in-page, anchors and assistive tech all behave normally.
 * Lenis only eases the wheel. It is driven by the GSAP ticker so the scroll,
 * ScrollTrigger and the WebGL frame all advance on the same beat.
 */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setLenis(null);
      return;
    }
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    setLenis(lenis);
    lenis.on("scroll", (l: Lenis) => {
      scene.scrollVelocity = l.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}
