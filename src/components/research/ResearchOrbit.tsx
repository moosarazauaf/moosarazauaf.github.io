import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { research } from "../../data/research";
import { GOLDEN_ANGLE, INV2, PHI, damp } from "../../lib/golden";
import { scene } from "../../three/sceneState";
import { ResearchObject } from "./ResearchObject";

interface Props {
  focus: string | null;
  onSelect: (id: string) => void;
  /** Scroll progress through the pinned section, 0..1, which turns the system. */
  progress: React.MutableRefObject<number>;
}

const INNER = 3; // the first three areas ride the inner orbit

/**
 * Lays the research areas on two tilted elliptical orbits around the globe:
 *   x = cx + cos(θ)·rx,  y = cy + sin(θ)·ry
 * with ry = 0.382·rx for the tilt, the outer orbit φ times the inner, and
 * speeds in φ ratio. Each object gets a small fixed wobble in radius so no
 * orbit is a perfect ellipse. Depth (sin θ) sets size and fade, and anything
 * passing behind the globe dims.
 */
export function ResearchOrbit({ focus, onSelect, progress }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const hovered = useRef<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const speed = { v: 1 };
    const angles = research.map((_, i) => i * GOLDEN_ANGLE + (i < INNER ? 0 : 0.7));
    const wobble = research.map((_, i) => 1 + 0.0618 * Math.sin(i * 2.399 + 1));
    const magnet = research.map(() => ({ x: 0, y: 0 }));
    const pointer = { x: -1e4, y: -1e4 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (_t: number, ms: number) => {
      const el = box.current;
      if (!el) return;
      const dt = Math.min(ms / 1000, 0.05);
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const w = rect.width;
      const h = rect.height;
      // Centred on the globe, wherever the camera frame has put it.
      const cx = w / 2 + scene.current.x * (w / 2);
      const cy = h / 2 - scene.current.y * (h / 2);
      // The globe's radius on screen, from the same frame the canvas uses.
      const globe = scene.current.r * (window.innerHeight / 2);
      const rx = Math.min(w * 0.236, Math.max(globe * PHI * 1.1, 200));
      const ry = rx * INV2 * 1.3;
      const still = scene.reducedMotion;
      speed.v = damp(speed.v, hovered.current || focus ? 0.236 : 1, 4, dt);
      const turn = still ? 0 : progress.current * Math.PI * INV2;

      if (svg.current) {
        svg.current.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const e = svg.current.querySelectorAll("ellipse");
        [1, PHI].forEach((k, i) => {
          e[i]?.setAttribute("cx", String(cx));
          e[i]?.setAttribute("cy", String(cy));
          e[i]?.setAttribute("rx", String(rx * k));
          e[i]?.setAttribute("ry", String(ry * k));
        });
      }

      research.forEach((a, i) => {
        const b = refs.current[i];
        if (!b) return;
        const outer = i >= INNER;
        const k = outer ? PHI : 1;
        if (!still) angles[i] += dt * speed.v * (outer ? 0.0618 : 0.0618 * PHI);
        const th = angles[i] + turn;
        const x = cx + Math.cos(th) * rx * k * wobble[i];
        const y = cy + Math.sin(th) * ry * k * wobble[i];
        const depth = Math.sin(th); // +1 nearest the viewer
        const behind = depth < 0 && Math.hypot(x - cx, y - cy) < globe * 1.05;

        // Magnetic pull toward the pointer, within 100px, at most 12px.
        const m = magnet[i];
        const px = pointer.x - rect.left - x;
        const py = pointer.y - rect.top - y;
        const d = Math.hypot(px, py);
        const pull = !still && d < 100 ? (1 - d / 100) * 12 : 0;
        m.x = damp(m.x, d ? (px / d) * pull : 0, 8, dt);
        m.y = damp(m.y, d ? (py / d) * pull : 0, 8, dt);

        const scale = 0.786 + 0.214 * (depth * 0.5 + 0.5);
        const isFocus = focus === a.id;
        const fade = focus ? (isFocus ? 1 : 0.02) : behind ? 0.18 : 0.5 + 0.5 * (depth * 0.5 + 0.5);
        b.style.transform = `translate3d(${x + m.x}px, ${y + m.y}px, 0) scale(${scale.toFixed(3)})`;
        b.style.opacity = fade.toFixed(3);
        b.style.zIndex = String(Math.round((depth + 1) * 50) + (hovered.current === a.id ? 200 : 0));
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
    };
  }, [focus, progress]);

  const onHover = (id: string | null) => {
    hovered.current = id;
    setHover(id);
  };

  return (
    <div ref={box} className={`rorbit ${focus ? "is-focus" : ""}`}>
      <svg ref={svg} className="rorbit-paths" aria-hidden="true">
        <ellipse />
        <ellipse />
      </svg>
      {research.map((a, i) => (
        <ResearchObject
          key={a.id}
          ref={(b) => {
            refs.current[i] = b;
          }}
          area={a}
          index={i}
          active={hover === a.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
