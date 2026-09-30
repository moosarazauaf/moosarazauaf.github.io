import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { scene } from "../../three/sceneState";

interface Props {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  cursor?: string;
  label?: string;
  external?: boolean;
  /** Pull strength: how far, in px, the element may travel toward the pointer. */
  strength?: number;
}

const RADIUS = 100;

/**
 * Drifts toward the pointer once it comes within 100px, up to `strength`
 * pixels, and settles back when it leaves. Uses quickTo so a moving pointer
 * never queues up a pile of tweens.
 */
export function MagneticButton({ href, onClick, className = "", children, cursor, label, external, strength = 12 }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || scene.reducedMotion || !window.matchMedia("(hover: hover)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.618, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.618, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = RADIUS + Math.max(r.width, r.height) / 2;
      const d = Math.hypot(dx, dy);
      if (d < reach) {
        const k = (1 - d / reach) * strength;
        xTo((dx / (d || 1)) * k);
        yTo((dy / (d || 1)) * k);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [strength]);

  const common = {
    ref,
    className: `magnetic ${className}`,
    "data-cursor": cursor,
    "aria-label": label,
  };
  if (href) {
    return (
      <a {...common} href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button {...common} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
