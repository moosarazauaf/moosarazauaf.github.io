import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { ArrowUpRight } from "lucide-react";
import { setFlipOrigin } from "../../animations/projectAnimations";
import { THEME_COLOR, projects } from "../../data/projects";
import type { Project } from "../../data/types";
import { rewind } from "../maps/GeoDataScene";
import type { DistrictProps } from "../maps/layers";
import { Abbr } from "../ui/Abbr";
import "./atlas.css";

type District = Feature<Geometry, DistrictProps>;

const W = 760;
const H = 820;
const THEMES = ["All", ...new Set(projects.map((p) => p.theme))];
const LEVELS = ["No studies", "1 study", "2 studies", "3 to 5 studies", "6 or more studies"];
const level = (n: number) => (n <= 2 ? n : n <= 5 ? 3 : 4);
const plural = (n: number) => `${n} ${n === 1 ? "study" : "studies"}`;

/**
 * Every district of Pakistan as a tile in a contribution graph: a district
 * with no study stays dark, and each study done there lights it a step
 * brighter, the way a day lights up on GitHub with each commit. A national
 * study has no single district, so it is listed everywhere and lights none.
 */
export function StudyAtlas({ onOpen }: { onOpen: (slug: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ districts: District[]; provinces: Feature[] } | null>(null);
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
        const get = <T,>(url: string) => fetch(url).then((r) => r.json() as Promise<T>);
        Promise.all([get<FeatureCollection<Geometry, DistrictProps>>("/geo/pakistan-districts.geojson"), get<FeatureCollection>("/geo/pakistan-provinces.geojson")])
          .then(([d, p]) => setGeo({ districts: (d.features as District[]).map(rewind), provinces: p.features }))
          .catch(() => setGeo(null));
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { byDistrict, national, shown } = useMemo(() => {
    const shown = projects.filter((p) => theme === "All" || p.theme === theme);
    const byDistrict = new Map<string, Project[]>();
    for (const p of shown)
      for (const d of new Set(p.sites.map((s) => s.district))) byDistrict.set(d, [...(byDistrict.get(d) ?? []), p]);
    return { byDistrict, national: shown.filter((p) => p.sites.length === 0), shown };
  }, [theme]);

  const drawn = useMemo(() => {
    if (!geo) return null;
    const path = geoPath(geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], { type: "FeatureCollection", features: geo.districts }));
    return {
      districts: geo.districts.map((f) => ({ name: f.properties.name, province: f.properties.province ?? "Gilgit-Baltistan", d: path(f) ?? "" })),
      provinces: geo.provinces.map((f) => path(f) ?? ""),
    };
  }, [geo]);

  const count = (d: string) => byDistrict.get(d)?.length ?? 0;
  const total = drawn?.districts.length ?? 126;
  const reached = [...byDistrict.keys()].sort((a, b) => count(b) - count(a) || a.localeCompare(b));
  const pickedDistrict = drawn?.districts.find((x) => x.name === picked);
  const list = picked ? byDistrict.get(picked) ?? [] : shown;
  const toggle = (d: string) => setPicked((c) => (c === d ? null : d));

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
                ? p.sites.filter((s) => s.district === picked).map((s) => s.name).join(", ")
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
            <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Map of Pakistan's districts, lit by the number of studies in each. Select a district to list its studies.">
              {drawn.districts.map((x) => {
                const n = count(x.name);
                return (
                  <path
                    key={x.name}
                    d={x.d}
                    className={`atlas-unit l${level(n)} ${picked === x.name ? "is-picked" : ""}`}
                    role="button"
                    tabIndex={n ? 0 : -1}
                    aria-pressed={picked === x.name}
                    aria-label={`${x.name}, ${x.province}: ${plural(n)}`}
                    data-cursor="VIEW"
                    onClick={() => toggle(x.name)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      toggle(x.name);
                    }}
                    onPointerMove={(e) => {
                      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top, name: x.name });
                    }}
                  />
                );
              })}
              <g className="atlas-provinces" aria-hidden="true">
                {drawn.provinces.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            </svg>
          ) : (
            <div className="atlas-loading meta">Loading the districts of Pakistan</div>
          )}
          {tip && (
            <div className="atlas-tip" style={{ transform: `translate(${tip.x + 14}px, ${tip.y + 14}px)` }}>
              <b>{tip.name}</b>
              <span className="meta">{plural(count(tip.name))}</span>
            </div>
          )}
          <figcaption className="atlas-legend meta">
            <span>Less</span>
            {LEVELS.map((l, i) => (
              <i key={l} className={`atlas-swatch l${i}`} title={l} />
            ))}
            <span>More</span>
            <span className="atlas-legend-note">
              {reached.length} of {total} districts reached. Thin lines are province borders. Boundaries from geoBoundaries; no position on disputed
              territory is implied.
            </span>
          </figcaption>
        </figure>

        <div className="atlas-panel" aria-live="polite">
          <div className="atlas-panel-head">
            <p className="meta">{pickedDistrict ? pickedDistrict.province : "Pakistan"}</p>
            <h3 className="h3">{picked ?? `${plural(shown.length)}, ${reached.length} of ${total} districts`}</h3>
            <p className="atlas-summary">
              {picked
                ? count(picked)
                  ? `${plural(count(picked))} with a site in this district.`
                  : "No study in this district yet. It is on the list."
                : reached.length
                  ? `Brightest: ${reached[0]} (${count(reached[0])}). Every new study lights another district.`
                  : "No district study under this theme."}
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

      <ul className="atlas-units" aria-label="Districts with studies">
        {reached.map((d) => (
          <li key={d}>
            <button type="button" className={picked === d ? "is-on" : ""} aria-pressed={picked === d} onClick={() => toggle(d)}>
              <i className={`atlas-swatch l${level(count(d))}`} aria-hidden="true" />
              {d}
              <span className="num">{count(d)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
