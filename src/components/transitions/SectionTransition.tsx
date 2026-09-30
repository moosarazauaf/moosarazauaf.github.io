import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneKey } from "../../three/sceneState";
import { scene } from "../../three/sceneState";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  id: string;
  sceneKey: SceneKey;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

/**
 * A section of the page. It registers with the camera system through
 * data-scene, and as it arrives its hairline draws across from the left,
 * the cue that one part of the story has handed over to the next.
 */
export function SectionTransition({ id, sceneKey, className = "", labelledBy, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const rule = ref.current?.querySelector(":scope > .section-rule");
    if (!rule || scene.reducedMotion) return;
    const t = gsap.fromTo(
      rule,
      { scaleX: 0 },
      { scaleX: 1, ease: "expo.out", duration: 1.618, scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } }
    );
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, []);
  return (
    <section ref={ref} id={id} className={`scene ${className}`} data-scene={sceneKey} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
