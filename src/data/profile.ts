import raw from "./profile.json";
import type { Profile } from "./types";

export const profile = raw as unknown as Profile;

/** Words for the page that are not facts about the work. Kept here so the
 *  voice can be edited without touching a component. */
export const copy = {
  descriptor: ["Earth observation researcher", "Remote sensing", "Geospatial AI", "Climate risk"],
  /** The first thing on the page: what the work is, not who did it. The name
   *  stays in the header and the page title. One line per row. */
  heroStatement: "Floods, drought\nand land change,\nmeasured from orbit.",
  heroSupport: "Thirteen open studies across Pakistan, each built so the numbers can be checked.",
  seeking: "Seeking a PhD position, 2027",
  /** The degree behind the work, stated in the first view. */
  credentials: "M.Sc. 2026, RUDN University, thesis graded Excellent",
  heroProof: [
    { value: "13", label: "studies, each public" },
    { value: "0.962", label: "F1 on unseen floods" },
    { value: "44 yrs", label: "drought record rebuilt" },
  ],
  researchIntro:
    "One question runs through all seven areas: can the number be trusted? Five are backed by finished studies and two are where the work is heading. Select one to see inside it.",
  sensingIntro:
    "Every study starts as a stack of satellite scenes. These are the instruments behind the thirteen, counted from the studies themselves.",
  projectsIntro:
    "Thirteen studies, each built end to end and each ending in a number someone else can check. The map shows where the work is: the deeper the green, the more studies. Pick a province to see them, or open Table 1 for the evidence behind all thirteen.",
  dataIntro:
    "Between 2000 and 2022, Lahore lost more carbon per hectare than any other district in Pakistan. This is real output from my national land and carbon account. Choose a layer.",
  aboutLead:
    "I measure floods, drought and land change from satellites, and I build each measurement so that someone else can check it.",
  contactLead:
    "If your group measures water, land or ground from orbit, I would like to hear what you are working on, and to tell you how I would test it.",
  /** Credit for the data the studies are built on. */
  dataCredits:
    "Data: Copernicus Sentinel-1 and Sentinel-2 (ESA), Landsat (USGS and NASA), CHIRPS (UCSB Climate Hazards Center), ERA5-Land (ECMWF, Copernicus C3S), GPM IMERG (NASA), GLC-FCS30D, Global Flood Database, geoBoundaries and Natural Earth. Processed in Google Earth Engine.",
};
