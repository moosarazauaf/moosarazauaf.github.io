import raw from "./projects.json";
import type { Direction, Project } from "./types";

export const projects = raw as Project[];

export const bySlug = (slug: string): Project | undefined => projects.find((p) => p.slug === slug);

/** The thesis leads the gallery; these follow it as full-width scenes. The
 *  rest are reachable from the index below them. */
export const FEATURED = "lahore-lulc-carbon";
/** The featured study is shown under the thesis's own framing. */
export const FEATURED_TITLE = "Long-term land-cover change and carbon stock estimation in Lahore";
/** Its cover: the district's land cover, epoch by epoch, in one strip. */
export const FEATURED_COVER = "img/hero-lahore-1920.jpg";
export const SELECTED = [
  "layyah-flood-monitor",
  "pakistan-lulc-carbon",
  "layyah-s1-flood-detection",
  "tharparkar-spi-drought",
];

/** Sensors and archives, as opposed to methods and tools. Used to split a
 *  study's tags into "data" and "methods" on its page. */
const DATASETS = new Set([
  "Sentinel-1 SAR",
  "Sentinel-2",
  "Landsat",
  "Landsat 8/9",
  "GLC-FCS30D",
  "GPM IMERG",
  "CHIRPS",
  "ERA5-Land",
]);
const TOOLS = new Set(["Google Earth Engine", "Python", "QGIS", "Streamlit"]);

export function splitTags(p: Project) {
  return {
    data: p.tags.filter((t) => DATASETS.has(t)),
    methods: p.tags.filter((t) => !DATASETS.has(t) && !TOOLS.has(t)),
    tools: p.tags.filter((t) => TOOLS.has(t)),
  };
}

/** Studies linked to this one, strongest bond first: a shared method or
 *  sensor (ignoring tags every study has), then a shared theme. */
export function linkedStudies(p: Project): { slug: string; why: string }[] {
  const count = new Map<string, number>();
  projects.forEach((q) => q.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
  const generic = (t: string) => (count.get(t) ?? 0) >= projects.length * 0.6;
  const out: { slug: string; why: string; w: number }[] = [];
  for (const q of projects) {
    if (q.slug === p.slug) continue;
    const shared = p.tags.filter((t) => !generic(t) && q.tags.includes(t));
    if (shared.length) out.push({ slug: q.slug, why: `Shares ${shared.join(", ")}`, w: 2 + shared.length });
    else if (q.theme === p.theme) out.push({ slug: q.slug, why: `Same theme: ${p.theme}`, w: 1 });
  }
  return out.sort((a, b) => b.w - a.w).map(({ slug, why }) => ({ slug, why }));
}

/** How many studies used each sensor. Counted, not typed in, so the numbers
 *  on the page can never drift from the studies themselves. */
export function sensorUse(): { name: string; count: number }[] {
  const names: [string, (t: string) => boolean][] = [
    ["Sentinel-1 SAR", (t) => t === "Sentinel-1 SAR"],
    ["Sentinel-2 MSI", (t) => t === "Sentinel-2"],
    ["Landsat archive", (t) => t.startsWith("Landsat")],
    ["Rainfall and reanalysis", (t) => ["CHIRPS", "ERA5-Land", "GPM IMERG"].includes(t)],
    ["Global land cover", (t) => t === "GLC-FCS30D"],
  ];
  return names.map(([name, test]) => ({
    name,
    count: projects.filter((p) => p.tags.some(test)).length,
  }));
}

/** Where the work is going next. These are open questions, labelled as such
 *  everywhere they appear, and never counted as studies. */
export const directions: Direction[] = [
  {
    id: "geotechnics",
    kind: "Research direction",
    title: "Remote sensing and AI for geotechnical hazards",
    question:
      "Can the event-based validation that made the flood susceptibility model trustworthy do the same for slope failure, using radar soil moisture and terrain as predictors?",
    buildsOn: ["layyah-flood-monitor", "layyah-s1-soil-moisture", "layyah-s2-soil-moisture-optram"],
    methods: ["Event-based susceptibility modelling", "Chronological holdout", "Random Forest"],
    data: ["Sentinel-1 SAR", "Digital elevation models", "Landslide inventories"],
  },
  {
    id: "kkh",
    kind: "Research direction",
    title: "Deformation along the Karakoram Highway",
    question:
      "How much of the ground movement along the Karakoram Highway can Sentinel-1 interferometry resolve, and how would you check it without ground instruments on every slope?",
    buildsOn: ["layyah-s1-speckle-filtering", "layyah-s1-flood-detection"],
    methods: ["InSAR time series", "Coherence analysis", "Independent validation design"],
    data: ["Sentinel-1 SLC", "GNSS where available"],
  },
];
