import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { damp } from "../lib/golden";

/**
 * Progress of an element through the viewport (0 as its top enters, 1 as its
 * bottom leaves), eased so it glides rather than stepping with the wheel.
 * Returned as a ref and fed to `onChange`, never as React state.
 */
export function useSmoothProgress(
  ref: RefObject<HTMLElement | null>,
  onChange: (p: number) => void,
  rate = 6.854
) {
  const cb = useRef(onChange);
  cb.current = onChange;
  const value = useRef(0);
  useEffect(() => {
    const tick = (_t: number, ms: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const next = damp(value.current, raw, rate, Math.min(ms / 1000, 0.05));
      if (Math.abs(next - value.current) > 1e-4) {
        value.current = next;
        cb.current(next);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [ref, rate]);
  return value;
}
