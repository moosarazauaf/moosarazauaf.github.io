import { useRef } from "react";
import { scene } from "../../three/sceneState";

/**
 * An invisible layer over the globe that turns pointer drags into rotation.
 * The canvas itself never takes the pointer, so the page scrolls normally
 * everywhere else; here, a horizontal drag spins the Earth and a release
 * leaves it coasting to a stop. Vertical touch drags still scroll the page.
 */
export function DragSurface({ className = "" }: { className?: string }) {
  const last = useRef({ x: 0, y: 0, t: 0, id: -1 });

  return (
    <div
      className={`drag-surface ${className}`}
      data-cursor="DRAG"
      aria-hidden="true"
      onPointerDown={(e) => {
        const l = last.current;
        l.x = e.clientX;
        l.y = e.clientY;
        l.t = performance.now();
        l.id = e.pointerId;
        scene.drag.active = true;
        scene.drag.vx = 0;
        scene.drag.vy = 0;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const l = last.current;
        if (!scene.drag.active || e.pointerId !== l.id) return;
        const now = performance.now();
        const dt = Math.max(8, now - l.t) / 1000;
        const dx = (e.clientX - l.x) * 0.0055;
        const dy = (e.clientY - l.y) * 0.0035;
        scene.drag.rotY += dx;
        scene.drag.rotX += dy;
        // Release velocity, capped so a flick cannot send it spinning wildly.
        scene.drag.vx = Math.max(-4, Math.min(4, dx / dt));
        scene.drag.vy = Math.max(-2, Math.min(2, dy / dt));
        l.x = e.clientX;
        l.y = e.clientY;
        l.t = now;
      }}
      onPointerUp={() => {
        scene.drag.active = false;
        scene.drag.vx *= 0.618;
        scene.drag.vy *= 0.382;
      }}
      onPointerCancel={() => {
        scene.drag.active = false;
      }}
    />
  );
}
