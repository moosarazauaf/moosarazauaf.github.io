import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { geoArea, geoGraticule, geoMercator, geoPath, geoDistance } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { copy } from "../../data/profile";
import { bySlug } from "../../data/projects";
import { INV2 } from "../../lib/golden";
import { useMobile } from "../../hooks/useMediaQuery";
import { scene } from "../../three/sceneState";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import { LayerSelector } from "./LayerSelector";
import { LAYERS, colorFor, studiesIn, type DistrictProps } from "./layers";
import "./maps.css";

type District = Feature<Geometry, DistrictProps>;
interface Meta {
  yearFrom: number;
  yearTo: number;
  source: string;
  boundaries: string;
  districtsWithData: number;
  districtsTotal: number;
}

/** d3 reads polygon winding the spherical way: a ring drawn clockwise
 *  (as geoBoundaries does) encloses everything except the district. Any
 *  feature whose area comes out larger than a hemisphere is flipped. */
function rewind(f: District): District {
  if (geoArea(f) <= 2 * Math.PI) return f;
  const g = f.geometry;
  const flip = (rings: number[][][]) => rings.map((r) => [...r].reverse());
  if (g.type === "Polygon") return { ...f, geometry: { ...g, coordinates: flip(g.coordinates) } };
  if (g.type === "MultiPolygon") return { ...f, geometry: { ...g, coordinates: g.coordinates.map(flip) } };
  return f;
}

const W = 1000;
const H = 1000;
const EARTH_KM = 6371;

/**
 * The camera dives into Pakistan on the globe, and as it lands the globe
 * hands over to this map: real district numbers from the national land and
 * carbon account. Scrolling through the pinned section steps through the
 * layers until the visitor picks one, after which the choice is theirs.
 */
export function GeoDataScene() {
  const pin = useRef<HTMLDivElement>(null);
  const mapBox = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ features: District[]; meta: Meta } | null>(null);
  const [layerId, setLayerId] = useState(LAYERS[0].id);
  const [tip, setTip] = useState<{ x: number; y: number; d: DistrictProps } | null>(null);
  const picked = useRef(false);
  const mobile = useMobile();
  const layer = LAYERS.find((l) => l.id === layerId) ?? LAYERS[0];

  // The outlines are 350 KB, so they load once the section is two screens away.
  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 300%",
      once: true,
      onEnter: () => {
        fetch("/geo/pakistan-districts.geojson")
          .then((r) => r.json())
          .then((g: FeatureCollection<Geometry, DistrictProps> & { meta: Meta }) =>
            setData({ features: (g.features as District[]).map(rewind), meta: g.meta })
          )
          .catch(() => setData(null));
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (scene.reducedMotion) {
      gsap.set(q(".geo-map"), { opacity: 1 });
      return;
    }
    const steps = LAYERS.length - 1; // the last layer is only ever picked
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: mobile
        ? { trigger: el, start: "top 60%", end: "top 10%", scrub: 0.618 }
        : {
            trigger: el,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.618,
            onUpdate: (s) => {
              if (picked.current) return;
              const t = (s.progress - INV2) / (1 - INV2);
              const i = Math.min(steps - 1, Math.max(0, Math.floor(t * steps)));
              setLayerId(LAYERS[i].id);
            },
          },
    });
    tl.fromTo(q(".geo-map"), { opacity: 0, scale: 1.382 }, { opacity: 1, scale: 1, duration: INV2 }, mobile ? 0 : INV2 * 0.618)
      .fromTo(q(".geo-side"), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: INV2 * 0.618 }, mobile ? 0 : INV2)
      .to({}, { duration: 1 - INV2 });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [mobile]);

  const drawn = useMemo(() => {
    if (!data) return null;
    const fc: FeatureCollection = { type: "FeatureCollection", features: data.features };
    const proj = geoMercator().fitExtent(
      [
        [40, 40],
        [W - 40, H - 40],
      ],
      fc
    );
    const path = geoPath(proj);
    const grat = geoGraticule().step([2, 2]).extent([
      [58, 22],
      [80, 38],
    ]);
    const [x0] = proj([60.5, 30]) ?? [0, 0];
    const [x1] = proj([77.5, 30]) ?? [W, 0];
    // A 200 km scale bar, measured at the map's middle latitude.
    const a = proj([66, 27]) ?? [0, 0];
    const km = geoDistance([66, 27], [67, 27]) * EARTH_KM;
    const b = proj([67, 27]) ?? [0, 0];
    const pxPerKm = (b[0] - a[0]) / km;
    const ticks = [62, 66, 70, 74].map((lon) => ({ lon, x: proj([lon, 24])?.[0] ?? 0 }));
    const lats = [26, 30, 34].map((lat) => ({ lat, y: proj([61, lat])?.[1] ?? 0 }));
    return {
      districts: data.features.map((f) => {
        const c = path.centroid(f);
        return { d: path(f) ?? "", props: f.properties, delay: (c[0] - x0) / (x1 - x0), c };
      }),
      grat: path(grat()) ?? "",
      scale: 200 * pxPerKm,
      ticks,
      lats,
    };
  }, [data]);

  const onMove = (e: React.PointerEvent, d: DistrictProps) => {
    const r = mapBox.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, d });
  };

  const thesis = bySlug("pakistan-lulc-carbon");

  return (
    <SectionTransition id="data" sceneKey="data" className="geo" labelledBy="geo-title">
      <div ref={pin} className="geo-pin">
        <div className="geo-grid shell">
          <div className="geo-side">
            <RevealText className="geo-head">
              <p className="meta" data-reveal>
                05 · Modelling
              </p>
              <SplitText as="h2" id="geo-title" className="display" text="Pakistan in data" />
              <p className="body" data-reveal>
                {copy.dataIntro}
              </p>
            </RevealText>
            <LayerSelector
              active={layer}
              onPick={(id) => {
                picked.current = true;
                setLayerId(id);
              }}
            />
            {data && (
              <p className="geo-source meta">
                Real data · {data.meta.source} · {data.meta.yearFrom} to {data.meta.yearTo} ·{" "}
                {data.meta.districtsWithData} of {data.meta.districtsTotal} districts with values · Boundaries:{" "}
                {data.meta.boundaries}
                {thesis?.liveUrl && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={thesis.liveUrl} target="_blank" rel="noopener" data-cursor="OPEN">
                      Open the live app
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          <div ref={mapBox} className="geo-map" onPointerLeave={() => setTip(null)}>
            {drawn ? (
              <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of Pakistan's districts: ${layer.title}, ${layer.unit}`}>
                <defs>
                  <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
                  </pattern>
                </defs>
                <path className="geo-grat" d={drawn.grat} />
                {drawn.ticks.map((t) => (
                  <text key={t.lon} className="geo-tick" x={t.x} y={H - 8} textAnchor="middle">
                    {t.lon}°E
                  </text>
                ))}
                {drawn.lats.map((t) => (
                  <text key={t.lat} className="geo-tick" x={8} y={t.y}>
                    {t.lat}°N
                  </text>
                ))}
                <g className="geo-districts">
                  {drawn.districts.map((x) => {
                    const v = layer.value(x.props);
                    const fill = colorFor(layer, v);
                    const studied = studiesIn(x.props.name).length > 0;
                    return (
                      <path
                        key={x.props.name + x.delay}
                        d={x.d}
                        className={`geo-d ${studied ? "is-studied" : ""}`}
                        style={{ fill: fill === "none" ? "url(#hatch)" : fill, transitionDelay: `${(x.delay * 0.618).toFixed(3)}s` }}
                        onPointerMove={(e) => onMove(e, x.props)}
                      />
                    );
                  })}
                </g>
                <g className="geo-scale" transform={`translate(${W - 60 - drawn.scale}, ${H - 60})`}>
                  <line x1="0" x2={drawn.scale} y1="0" y2="0" />
                  <line x1="0" x2="0" y1="-5" y2="5" />
                  <line x1={drawn.scale} x2={drawn.scale} y1="-5" y2="5" />
                  <text x={drawn.scale / 2} y="-10" textAnchor="middle">
                    200 km
                  </text>
                </g>
                <g className="geo-north" transform={`translate(${W - 60}, 70)`}>
                  <path d="M0 -22 L7 6 L0 0 L-7 6 Z" />
                  <text y="24" textAnchor="middle">
                    N
                  </text>
                </g>
              </svg>
            ) : (
              <div className="geo-loading meta">Loading district outlines</div>
            )}
            {tip && (
              <div className="geo-tip" style={{ transform: `translate(${tip.x + 16}px, ${tip.y + 16}px)` }}>
                <p className="geo-tip-name">{tip.d.name}</p>
                <p className="meta">{tip.d.province}</p>
                <p className="geo-tip-v num">
                  {(() => {
                    const v = layer.value(tip.d);
                    return v === null ? "No district value" : layer.format(v);
                  })()}
                </p>
                {studiesIn(tip.d.name).length > 0 && <p className="meta geo-tip-study">Study: {studiesIn(tip.d.name).join(", ")}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionTransition>
  );
}
