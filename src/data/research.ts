import { projects } from "./projects";
import type { ResearchArea } from "./types";

const withTag = (...tags: string[]) =>
  projects.filter((p) => p.tags.some((t) => tags.some((x) => t.startsWith(x)))).map((p) => p.slug);
const withTheme = (theme: string) => projects.filter((p) => p.theme === theme).map((p) => p.slug);

/** The research system in the orbit section. "Core" areas are backed by
 *  finished studies, "Platform" is the tooling under all of them, and a
 *  "Direction" is where the work is heading, with no study claimed. */
export const research: ResearchArea[] = [
  {
    id: "remote-sensing",
    title: "Remote Sensing",
    category: "Observation",
    status: "Core",
    summary:
      "Radar and optical time series turned into measurements of water, crops and vegetation, each one checked against a second, independent sensor.",
    methods: ["Change detection", "Speckle filtering", "Spectral indices", "Scene-by-scene mapping"],
    data: ["Sentinel-1 SAR", "Sentinel-2 MSI", "Landsat 5 to 9"],
    applications: ["Flood extent", "Crop mapping", "Post-flood vegetation loss"],
    studies: withTag("Sentinel", "Landsat"),
  },
  {
    id: "geo-ai",
    title: "Geospatial AI",
    category: "Modelling",
    status: "Core",
    summary:
      "Machine learning that is scored on years it never saw. The flood model reaches F1 = 0.962 on held-out events, with the split made by time, not at random.",
    methods: ["Random Forest", "SVM and CART", "CA-Markov", "Chronological holdout"],
    data: ["Global Flood Database events", "Labelled land-cover samples"],
    applications: ["Flood susceptibility", "Land-cover classification", "Land-cover projection"],
    studies: withTag("Random Forest", "Machine Learning", "CA-Markov"),
  },
  {
    id: "insar",
    title: "InSAR",
    category: "Ground motion",
    status: "Direction",
    summary:
      "Radar interferometry is the next step from the amplitude SAR in my current work: measuring millimetres of ground movement instead of the presence of water.",
    methods: ["Interferometric time series", "Coherence analysis"],
    data: ["Sentinel-1 SLC"],
    applications: ["Subsidence", "Slope deformation", "Infrastructure monitoring"],
    studies: [],
  },
  {
    id: "land-systems",
    title: "Land Systems",
    category: "Change",
    status: "Core",
    summary:
      "Thirty years of land-cover change and what it cost in carbon, from a single district to a national account covering every district of Pakistan.",
    methods: ["Random Forest classification", "InVEST carbon", "CA-Markov projection"],
    data: ["Landsat archive, 1993 to 2023", "GLC-FCS30D"],
    applications: ["Urban expansion", "Carbon accounting", "Land-use planning"],
    studies: withTheme("Land change & carbon"),
  },
  {
    id: "climate",
    title: "Climate",
    category: "Extremes",
    status: "Core",
    summary:
      "Drought and wetness measured from orbit: a 44-year rainfall record for Tharparkar, and soil moisture retrieved three independent ways over Layyah.",
    methods: ["SPI with zero-inflated fit", "OPTRAM and TOTRAM", "SAR soil moisture"],
    data: ["CHIRPS", "ERA5-Land", "GPM IMERG", "Landsat thermal"],
    applications: ["Drought monitoring", "Antecedent flood conditions", "Irrigation stress"],
    studies: withTheme("Drought & soil moisture"),
  },
  {
    id: "geotechnics",
    title: "Geotechnics",
    category: "Ground hazard",
    status: "Direction",
    summary:
      "Using the same event-based validation to model slope failure, with radar soil moisture, terrain and deformation as predictors.",
    methods: ["Susceptibility modelling", "Chronological holdout"],
    data: ["Sentinel-1", "Elevation models", "Landslide inventories"],
    applications: ["Landslide susceptibility", "Highway corridors", "Early warning"],
    studies: [],
  },
  {
    id: "gee",
    title: "Google Earth Engine",
    category: "Platform",
    status: "Platform",
    summary:
      "Every study runs as a public, re-runnable Earth Engine pipeline, from a single district up to 864,256 km² of Pakistan at 30 m.",
    methods: ["Server-side pipelines", "Reproducible exports", "Operator audits"],
    data: ["The full Earth Engine catalogue"],
    applications: ["National-scale analysis", "Open, checkable results"],
    studies: withTag("Google Earth Engine"),
  },
];
