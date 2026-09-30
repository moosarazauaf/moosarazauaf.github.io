import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./transitions.css";

interface Props {
  /** 0..1, how much of what the first view needs has arrived. */
  progress: number;
  done: boolean;
  onGone: () => void;
}

/**
 * The loading screen: initials and a thin line that fills as the fonts and
 * the globe's outlines arrive. It lifts away as soon as they are in, and is
 * never held open for effect.
 */
export function PageTransition({ progress, done, onGone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bar.current) gsap.to(bar.current, { scaleX: progress, duration: 0.618, ease: "power2.out" });
  }, [progress]);

  useEffect(() => {
    if (!done || !root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: onGone });
    if (reduced) {
      tl.to(root.current, { autoAlpha: 0, duration: 0.236 });
    } else {
      tl.to(bar.current, { scaleX: 1, duration: 0.382, ease: "power2.out" })
        .to(root.current.querySelector(".loader-mark"), { yPercent: -110, duration: 0.8, ease: "expo.in" }, "+=0.1")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "-=0.3");
    }
    return () => {
      tl.kill();
    };
  }, [done, onGone]);

  return (
    <div ref={root} className="loader" role="status" aria-live="polite">
      <div className="loader-mask">
        <span className="loader-mark">MR</span>
      </div>
      <span className="loader-line" aria-hidden="true">
        <span ref={bar} />
      </span>
      <span className="visually-hidden">{done ? "Loaded" : "Loading"}</span>
    </div>
  );
}
