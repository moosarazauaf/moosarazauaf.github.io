import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scene } from "../../three/sceneState";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Delay in seconds after the element enters. */
  delay?: number;
  id?: string;
}

/**
 * Reveals its content once, as it scrolls into view: masked words (from
 * SplitText) rise into place, anything marked [data-reveal] fades up. Under
 * reduced motion the content is simply there.
 */
export function RevealText({ as: Tag = "div", className, children, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll(".wi");
    const fades = el.querySelectorAll("[data-reveal]");
    if (scene.reducedMotion) {
      gsap.set(fades, { opacity: 1 });
      return;
    }
    gsap.set(words, { yPercent: 105 });
    const tl = gsap.timeline({
      paused: true,
      delay,
      defaults: { ease: "expo.out", duration: 1.618 },
    });
    tl.to(words, { yPercent: 0, stagger: 0.0618 }, 0).fromTo(
      fades,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, stagger: 0.0618, duration: 1 },
      0.236
    );
    const st = ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      tl.kill();
    };
  }, [delay]);
  return createElement(Tag, { ref, className, id }, children);
}
