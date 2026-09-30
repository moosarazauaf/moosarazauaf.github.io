import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { damp } from "../../lib/golden";
import { bySlug } from "../../data/projects";

/**
 * The image that trails the pointer over the study index. It follows with
 * lag and leans in the direction of travel, so moving down the list feels
 * like flicking through prints.
 */
export function ProjectPreview({ slug }: { slug: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const p = slug ? bySlug(slug) : undefined;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const target = { x: 0, y: 0 };
    const at = { x: 0, y: 0, tilt: 0 };
    let seen = false;
    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        seen = true;
        at.x = target.x;
        at.y = target.y;
      }
    };
    const tick = (_t: number, ms: number) => {
      const dt = Math.min(ms / 1000, 0.05);
      const px = at.x;
      at.x = damp(at.x, target.x, 8, dt);
      at.y = damp(at.y, target.y, 8, dt);
      at.tilt = damp(at.tilt, Math.max(-8, Math.min(8, (at.x - px) * 0.6)), 6, dt);
      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) rotate(${at.tilt.toFixed(2)}deg)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={box} className={`ppreview ${p ? "is-on" : ""}`} aria-hidden="true">
      <div className="ppreview-card">
        {p && <img key={p.slug} src={`/${p.image}`} alt="" />}
      </div>
    </div>
  );
}
