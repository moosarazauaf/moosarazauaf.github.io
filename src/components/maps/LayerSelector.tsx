import { LAYERS, gradientCss, type Layer } from "./layers";

interface Props {
  active: Layer;
  onPick: (id: string) => void;
}

/** Floating layer controls and the legend for the active layer. Small on
 *  purpose: the map is the subject, not the controls. */
export function LayerSelector({ active, onPick }: Props) {
  return (
    <div className="layers">
      <div className="layer-buttons" role="radiogroup" aria-label="Map layer">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={l.id === active.id}
            className={`layer-btn ${l.id === active.id ? "is-on" : ""}`}
            onClick={() => onPick(l.id)}
            data-cursor="SHOW"
          >
            <span className="layer-swatch" style={{ background: gradientCss(l) }} aria-hidden="true" />
            {l.label}
          </button>
        ))}
      </div>
      <div className="legend" aria-live="polite">
        <p className="legend-title">{active.title}</p>
        <p className="meta">{active.unit}</p>
        <span className="legend-bar" style={{ background: gradientCss(active) }} aria-hidden="true" />
        <p className="legend-ends meta num">
          <span>
            {active.open[0] ? "≤ " : ""}
            {active.format(active.domain[0])}
          </span>
          {active.diverging && <span>0</span>}
          <span>
            {active.open[1] ? "≥ " : ""}
            {active.format(active.domain[1])}
          </span>
        </p>
        <p className="legend-nodata meta">
          <i aria-hidden="true" /> Hatched: no district-level value
        </p>
        <p className="legend-note">{active.note}</p>
      </div>
    </div>
  );
}
