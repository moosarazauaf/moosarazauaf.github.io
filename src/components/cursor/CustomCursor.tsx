import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { damp } from "../../lib/golden";
import "./cursor.css";

/**
 * A dot that sits on the pointer and a ring that follows it with lag. Over
 * anything marked data-cursor the ring opens to about 60px and names the
 * action: VIEW, EXPLORE, OPEN, DRAG. Mounted only for a fine, hovering
 * pointer with motion allowed; everyone else keeps the system cursor.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const p = { x: -100, y: -100 };
    const r = { x: -100, y: -100 };
    let seen = false;
    let current = "";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (!seen) {
        seen = true;
        r.x = p.x;
        r.y = p.y;
        root.classList.add("cursor-on");
      }
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const hit = t?.closest<HTMLElement>("[data-cursor], a, button, [role='button'], label, select");
      const text = hit?.dataset.cursor ?? "";
      const hot = !!hit;
      if (text !== current) {
        current = text;
        if (label.current) label.current.textContent = text;
      }
      ring.current?.classList.toggle("is-label", !!text);
      ring.current?.classList.toggle("is-hot", hot && !text);
      dot.current?.classList.toggle("is-hidden", !!text);
    };
    const leave = () => root.classList.remove("cursor-on");
    const enter = () => seen && root.classList.add("cursor-on");
    const down = () => ring.current?.classList.add("is-down");
    const up = () => ring.current?.classList.remove("is-down");

    // The ring eases toward the pointer, the same as x += (target - x) * 0.15
    // at 60fps, but written so it behaves the same at any frame rate.
    const tick = (_t: number, ms: number) => {
      const dt = Math.min(ms / 1000, 0.05);
      r.x = damp(r.x, p.x, 9.75, dt);
      r.y = damp(r.y, p.y, 9.75, dt);
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    gsap.ticker.add(tick);
    return () => {
      root.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
