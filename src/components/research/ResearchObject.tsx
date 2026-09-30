import { forwardRef } from "react";
import type { ResearchArea } from "../../data/types";

interface Props {
  area: ResearchArea;
  index: number;
  active: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * One research area as an object in orbit: a real button, so it can be
 * reached by keyboard and read by a screen reader, positioned every frame by
 * ResearchOrbit. On hover it grows and its summary unfolds.
 */
export const ResearchObject = forwardRef<HTMLButtonElement, Props>(function ResearchObject(
  { area, index, active, onHover, onSelect },
  ref
) {
  const n = area.studies.length;
  return (
    <button
      ref={ref}
      type="button"
      className={`robj is-${area.status.toLowerCase()} ${active ? "is-active" : ""}`}
      data-id={area.id}
      data-cursor="EXPLORE"
      aria-haspopup="dialog"
      aria-label={`${area.title}: ${area.status === "Direction" ? "research direction" : `${n} studies`}. Open details.`}
      onPointerEnter={() => onHover(area.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(area.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(area.id)}
    >
      <span className="robj-inner">
        <span className="robj-dot" aria-hidden="true" />
        <span className="robj-text">
          <span className="robj-meta meta">
            {String(index + 1).padStart(2, "0")} · {area.status === "Direction" ? "Direction" : area.category}
          </span>
          <span className="robj-title">{area.title}</span>
          <span className="robj-summary">{area.summary}</span>
        </span>
      </span>
    </button>
  );
});
