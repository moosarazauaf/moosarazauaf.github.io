import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, X } from "lucide-react";
import { bySlug } from "../../data/projects";
import type { ResearchArea } from "../../data/types";
import { scene } from "../../three/sceneState";

interface Props {
  area: ResearchArea | null;
  onClose: () => void;
  onOpenStudy: (slug: string) => void;
}

/**
 * The open research area. The globe has moved aside and the other objects
 * have faded, so this becomes the only thing on screen: what the area is,
 * its methods, data and applications, and the studies behind it.
 */
export function ResearchDetail({ area, onClose, onOpenStudy }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !area) return;
    closeBtn.current?.focus({ preventScroll: true });
    if (!scene.reducedMotion) {
      gsap.fromTo(
        el.querySelectorAll("[data-d]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.0618 }
      );
    }
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [area, onClose]);

  if (!area) return null;
  const direction = area.status === "Direction";
  const cols: [string, string[]][] = [
    [direction ? "Methods to apply" : "Methods", area.methods],
    ["Data", area.data],
    ["Applications", area.applications],
  ];

  return (
    <div ref={root} className="rdetail" role="dialog" aria-modal="false" aria-labelledby="rdetail-title">
      <button ref={closeBtn} type="button" className="rdetail-close meta" onClick={onClose} data-cursor="CLOSE">
        <X size={14} strokeWidth={1.5} aria-hidden="true" /> Back to the system
      </button>
      <p className="meta" data-d>
        Research area · {area.category}
        {direction && <span className="tag-direction">Research direction, no study yet</span>}
      </p>
      <h3 id="rdetail-title" className="rdetail-title" data-d>
        {area.title}
      </h3>
      <p className="lead rdetail-summary" data-d>
        {area.summary}
      </p>
      <div className="rdetail-cols" data-d>
        {cols.map(([label, items]) => (
          <div key={label}>
            <p className="meta">{label}</p>
            <ul>
              {items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {area.studies.length > 0 && (
        <div className="rdetail-studies" data-d>
          <p className="meta">
            {area.studies.length} {area.studies.length === 1 ? "study" : "studies"} inside
          </p>
          <div className="rdetail-chips">
            {area.studies.map((s) => {
              const p = bySlug(s);
              return p ? (
                <button key={s} type="button" className="chip" onClick={() => onOpenStudy(s)} data-cursor="VIEW">
                  {p.short}
                  <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
