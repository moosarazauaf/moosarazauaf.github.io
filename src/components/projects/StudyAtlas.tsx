import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, MultiPolygon } from "geojson";
import { ArrowUpRight } from "lucide-react";
import { setFlipOrigin } from "../../animations/projectAnimations";
import { THEME_COLOR, projects } from "../../data/projects";
import type { Project } from "../../data/types";
import { Abbr } from "../ui/Abbr";
import "./atlas.css";

type Unit = Feature<MultiPolygon, { name: string }>;

const W = 760;
const H = 820;
const UNITS = ["Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkhwa", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu and Kashmir"];
const MAP_LABEL: Record<string, string> = { "Khyber Pakhtunkhwa": "KP", "Azad Jammu and Kashmir": "AJK", "Islamabad Capital Territory": "" };
const THEMES = ["All", ...new Set(projects.map((p) => p.theme))];
const LEVELS = ["None", "1", "2", "3 to 5", "6 or more"];
const level = (n: number) => (n <= 2 ? n : n <= 5 ? 3 : 4);
const plural = (n: number) => `${n} ${n === 1 ? "study" : "studies"}`;

/**
 * The studies as a map, read like a contribution graph: the more work done in
 * a province, the deeper its green, and a province with none stays empty. A
 * national study has no single place, so it is listed everywhere and darkens
 * nowhere.
 */
export function StudyAtlas({ onOpen }: { onOpen: (slug: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [theme, setTheme] = useState("All");
  const [picked, setPicked] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; name: string } | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/geo/pakistan-provinces.geojson")
          .then((r) => r.json())
          .then((g: FeatureCollection<MultiPolygon, { name: string }>) => setUnits(g.features))
          .catch(() => setUnits(null));
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { byUnit, national, dots, shown } = useMemo(() => {
    const shown = projects.filter((p) => theme === "All" || p.theme === theme);
    const byUnit = new Map<string, Project[]>(UNITS.map((u) => [u, shown.filter((p) => p.sites.some((s) => s.province === u))]));
    const dots = new Map<string, { name: string; lat: number; lon: number; n: number }>();
    for (const p of shown)
      for (const s of p.sites) {
        const d = dots.get(s.name) ?? { name: s.name, lat: s.lat, lon: s.lon, n: 0 };
        d.n += 1;
        dots.set(s.name, d);
      }
    return { byUnit, national: shown.filter((p) => p.sites.length === 0), dots: [...dots.values()], shown };
  }, [theme]);

  const drawn = useMemo(() => {
    if (!units) return null;
    const projection = geoMercator().fitExtent([[14, 14], [W - 14, H - 14]], { type: "FeatureCollection", features: units });
    const path = geoPath(projection);
    return { projection, shapes: units.map((f) => ({ name: f.properties.name, d: path(f) ?? "", at: path.centroid(f) })) };
  }, [units]);

  const count = (u: string) => byUnit.get(u)?.length ?? 0;
  const reached = UNITS.filter((u) => count(u) > 0);
  const empty = UNITS.filter((u) => count(u) === 0);
  const top = [...reached].sort((a, b) => count(b) - count(a))[0];
  const list = picked ? byUnit.get(picked) ?? [] : shown;
  const toggle = (u: string) => setPicked((c) => (c === u ? null : u));

  const row = (p: Project) => (
    <li key={p.slug}>
      <a
        className="atlas-study"
        href={`#project/${p.slug}`}
        data-cursor="VIEW"
        style={{ boxShadow: `inset 2px 0 0 ${THEME_COLOR[p.theme]}` }}
        onClick={(e) => {
          e.preventDefault();
          setFlipOrigin(e.currentTarget);
          onOpen(p.slug);
        }}
      >
        <span className="atlas-study-top meta">
          <span>
            {!p.sites.length
              ? "All of Pakistan"
              : picked
                ? p.sites.filter((s) => s.province === picked).map((s) => s.name).join(", ")
                : p.sites.length > 2
                  ? p.place.name
                  : p.sites.map((s) => s.name).join(", ")}
          </span>
          <b className="num">{p.metrics[0].value}</b>
        </span>
        <span className="atlas-study-name">{p.short}</span>
        <span className="atlas-study-finding">
          <Abbr>{p.finding}</Abbr>
        </span>
        <ArrowUpRight className="atlas-study-arrow" size={15} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </li>
  );

  return (
    <div ref={root} className="atlas" id="evidence">
      <div className="atlas-filters" role="group" aria-label="Filter the map by theme">
        {THEMES.map((t) => (
          <button key={t} type="button" className={`chip ${t === theme ? "is-on" : ""}`} aria-pressed={t === theme} onClick={() => setTheme(t)}>
            {t !== "All" && <i className="theme-dot" style={{ background: THEME_COLOR[t] }} aria-hidden="true" />}
            {t}
            <span className="chip-n num">{t === "All" ? projects.length : projects.filter((p) => p.theme === t).length}</span>
          </button>
        ))}
      </div>

      <div className="atlas-grid">
        <figure className="atlas-map" onPointerLeave={() => setTip(null)}>
          {drawn ? (
            <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Map of Pakistan, shaded by the number of studies in each province. Select a province to list its studies.">
              {drawn.shapes.map((s) => (
                <path
                  key={s.name}
                  d={s.d}
                  className={`atlas-unit l${level(count(s.name))} ${picked === s.name ? "is-picked" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={picked === s.name}
                  aria-label={`${s.name}: ${plural(count(s.name))}`}
                  data-cursor="VIEW"
                  onClick={() => toggle(s.name)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    toggle(s.name);
                  }}
                  onPointerMove={(e) => {
                    const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top, name: s.name });
                  }}
                />
              ))}
              {drawn.shapes.map((s) => {
                const label = MAP_LABEL[s.name] ?? s.name;
                return label ? (
                  <text key={s.name} className={`atlas-label l${level(count(s.name))}`} x={s.at[0]} y={s.at[1]} textAnchor="middle">
                    {label}
                  </text>
                ) : null;
              })}
              {dots.map((d) => {
                const [x, y] = drawn.projection([d.lon, d.lat]) ?? [0, 0];
                const r = 4 + Math.sqrt(d.n) * 3.2;
                return (
                  <g key={d.name} className="atlas-dot" transform={`translate(${x}, ${y})`} aria-hidden="true">
                    <circle r={r} />
                    {d.n > 1 && (
                      <text y="3.5" textAnchor="middle">
                        {d.n}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="atlas-loading meta">Loading the map of Pakistan</div>
          )}
          {tip && (
            <div className="atlas-tip" style={{ transform: `translate(${tip.x + 14}px, ${tip.y + 14}px)` }}>
              <b>{tip.name}</b>
              <span className="meta">{plural(count(tip.name))}</span>
            </div>
          )}
          <figcaption className="atlas-legend meta">
            <span>Fewer</span>
            {LEVELS.map((l, i) => (
              <i key={l} className={`atlas-swatch l${i}`} title={`${l} ${i === 1 ? "study" : "studies"}`} />
            ))}
            <span>More</span>
            <span className="atlas-legend-note">Circles mark study sites. Boundaries from geoBoundaries; no position on disputed territory is implied.</span>
          </figcaption>
        </figure>

        <div className="atlas-panel" aria-live="polite">
          <div className="atlas-panel-head">
            <p className="meta">{picked ? "Province" : "Pakistan"}</p>
            <h3 className="h3">{picked ?? `${plural(shown.length)}, ${reached.length} of ${UNITS.length} regions`}</h3>
            <p className="atlas-summary">
              {picked
                ? count(picked)
                  ? `${plural(count(picked))} with a site here.`
                  : "No site study here yet. This is open ground for the next one."
                : top
                  ? `Most of the work is in ${top} (${count(top)}).${empty.length ? ` Not yet reached: ${empty.join(", ")}.` : ""}`
                  : "No site study under this theme."}
            </p>
            {picked && (
              <button type="button" className="atlas-clear meta" onClick={() => setPicked(null)}>
                Show all of Pakistan
              </button>
            )}
          </div>
          <ol className="atlas-list" data-lenis-prevent>
            {list.map(row)}
            {picked && national.map(row)}
          </ol>
        </div>
      </div>

      <ul className="atlas-units" aria-label="Provinces and territories">
        {UNITS.map((u) => (
          <li key={u}>
            <button type="button" className={picked === u ? "is-on" : ""} aria-pressed={picked === u} onClick={() => toggle(u)}>
              <i className={`atlas-swatch l${level(count(u))}`} aria-hidden="true" />
              {u}
              <span className="num">{count(u)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
