import { projects } from "../../data/projects";

/** One district's numbers, as written by scripts/build_pakistan_districts.py
 *  from the national app's own tables. Missing numbers stay missing. */
export interface DistrictProps {
  name: string;
  province: string;
  areaHa?: number;
  builtupPct?: number;
  builtupGainHa?: number;
  vegChangeHa?: number;
  netMgC?: number;
  netMgCPerHa?: number;
}

type RGB = [number, number, number];

export interface Layer {
  id: string;
  label: string;
  title: string;
  unit: string;
  note: string;
  value: (d: DistrictProps) => number | null;
  /** Legend ends, in the layer's unit. Values beyond them are clamped. */
  domain: [number, number];
  /** Whether values run past each end of the legend and are clamped to it. */
  open: [boolean, boolean];
  diverging: boolean;
  ramp: RGB[];
  format: (v: number) => string;
}

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const LOW = hex("#26261f");
const MID = hex("#3a3a33");
const PAPER = hex("#f4f3ef");
const RADAR = hex("#e0521f");
// Orange against teal stays distinguishable under red-green colour blindness,
// which orange against green does not.
const GAIN = hex("#3fb5a3");
const OCHRE = hex("#d69a3a");
const WATER = hex("#5a93c2");

const per = (d: DistrictProps, k: keyof DistrictProps) => {
  const v = d[k];
  return typeof v === "number" && d.areaHa ? (v / d.areaHa) * 100 : null;
};
const num = (d: DistrictProps, k: keyof DistrictProps) => {
  const v = d[k];
  return typeof v === "number" ? v : null;
};
const signed = (v: number, digits = 1) => `${v > 0 ? "+" : ""}${v.toFixed(digits)}`;

/** Study districts, matched by name against the map's district names. */
const STUDY_DISTRICTS = new Map<string, string[]>();
for (const p of projects) {
  const names =
    p.place.name === "Islamabad and Rawalpindi"
      ? ["Islamabad Capital Territory", "Rawalpindi"]
      : p.place.name === "Pakistan"
        ? []
        : [p.place.name.replace(" District", "")];
  for (const n of names) STUDY_DISTRICTS.set(n, [...(STUDY_DISTRICTS.get(n) ?? []), p.short]);
}
export const studiesIn = (name: string) => STUDY_DISTRICTS.get(name) ?? [];

export const LAYERS: Layer[] = [
  {
    id: "carbon",
    label: "Carbon",
    title: "Net carbon change",
    unit: "Mg C per ha, 2000 to 2022",
    note: "Gain in teal, loss in orange, from 30 m land-cover transitions. Lahore, the thesis district, shows the steepest loss per hectare in the country.",
    value: (d) => num(d, "netMgCPerHa"),
    domain: [-3, 6],
    open: [false, true],
    diverging: true,
    ramp: [RADAR, MID, GAIN],
    format: (v) => `${signed(v, 2)} Mg C/ha`,
  },
  {
    id: "builtup",
    label: "Built-up",
    title: "Built-up share",
    unit: "% of district, 2022",
    note: "How much of each district is built over. Lahore leads at about 35%.",
    value: (d) => num(d, "builtupPct"),
    domain: [0, 20],
    open: [false, true],
    diverging: false,
    ramp: [LOW, OCHRE, PAPER],
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    id: "growth",
    label: "Urban growth",
    title: "New built-up land",
    unit: "% of district, 2000 to 2022",
    note: "Land that became built-up over the period, as a share of the district.",
    value: (d) => per(d, "builtupGainHa"),
    domain: [0, 4],
    open: [true, true],
    diverging: false,
    ramp: [LOW, RADAR, PAPER],
    format: (v) => `${signed(v, 2)}%`,
  },
  {
    id: "vegetation",
    label: "Vegetation",
    title: "Vegetation change",
    unit: "% of district, 2000 to 2022",
    note: "Net gain or loss of vegetated land classes as a share of the district.",
    value: (d) => per(d, "vegChangeHa"),
    domain: [-6, 6],
    open: [true, true],
    diverging: true,
    ramp: [RADAR, MID, GAIN],
    format: (v) => `${signed(v, 2)}%`,
  },
  {
    id: "studies",
    label: "Studies",
    title: "Where the studies are",
    unit: "district-scale studies",
    note: "Districts with a dedicated study. The national account covers all of them.",
    value: (d) => (studiesIn(d.name).length ? studiesIn(d.name).length : 0),
    domain: [0, 4],
    open: [false, false],
    diverging: false,
    ramp: [MID, WATER, PAPER],
    format: (v) => (v ? `${v} ${v === 1 ? "study" : "studies"}` : "Covered by the national account"),
  },
];

/** Colour for a value on a layer's ramp: two segments, clamped at the ends. */
export function colorFor(layer: Layer, v: number | null): string {
  if (v === null || Number.isNaN(v)) return "none";
  const [lo, hi] = layer.domain;
  let t: number;
  if (layer.diverging) {
    // Zero sits in the middle of the ramp, whatever the domain's asymmetry.
    t = v < 0 ? 0.5 - 0.5 * Math.min(1, v / lo) : 0.5 + 0.5 * Math.min(1, v / hi);
  } else {
    t = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  }
  const [a, b, c] = layer.ramp;
  const [p, q, s] = t < 0.5 ? [a, b, t * 2] : [b, c, (t - 0.5) * 2];
  const mix = (i: number) => Math.round(p[i] + (q[i] - p[i]) * s);
  return `rgb(${mix(0)} ${mix(1)} ${mix(2)})`;
}

export function gradientCss(layer: Layer) {
  const c = (x: number) => colorFor(layer, layer.domain[0] + (layer.domain[1] - layer.domain[0]) * x);
  if (layer.diverging) {
    return `linear-gradient(90deg, ${colorFor(layer, layer.domain[0])}, ${colorFor(layer, 0)}, ${colorFor(layer, layer.domain[1])})`;
  }
  return `linear-gradient(90deg, ${c(0)}, ${c(0.5)}, ${c(1)})`;
}
