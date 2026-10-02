import raw from "./profile.json";
import type { Profile } from "./types";

export const profile = raw as unknown as Profile;

/** Words for the page that are not facts about the work. Kept here so the
 *  voice can be edited without touching a component. */
export const copy = {
  descriptor: ["Earth observation researcher", "Remote sensing", "Geospatial AI", "Climate risk"],
  seeking: "Seeking a PhD position, 2026/27",
  heroProof: [
    { value: "12", label: "studies, each public" },
    { value: "0.962", label: "F1 on unseen floods" },
    { value: "44 yrs", label: "drought record rebuilt" },
  ],
  researchIntro:
    "One question runs through all seven areas: can the number be trusted? Five are backed by finished studies and two are where the work is heading. Select one to see inside it.",
  sensingIntro:
    "Every study starts as a stack of satellite scenes. These are the instruments behind the twelve, counted from the studies themselves.",
  projectsIntro:
    "Twelve studies, each built end to end and each ending in a number someone else can check. The thesis first, then four results I would put in front of a committee.",
  dataIntro:
    "Between 2000 and 2022, Lahore lost more carbon per hectare than any other district in Pakistan. This is real output from my national land and carbon account. Choose a layer.",
  aboutLead:
    "I measure floods, drought and land change from satellites, and I build each measurement so that someone else can check it.",
  contactLead:
    "If your group measures water, land or ground from orbit, I would like to hear what you are working on, and to tell you how I would test it.",
  /** Credit for the data the studies are built on. */
  dataCredits:
    "Data: Copernicus Sentinel-1 and Sentinel-2 (ESA), Landsat (USGS and NASA), CHIRPS (UCSB Climate Hazards Center), ERA5-Land (ECMWF, Copernicus C3S), GPM IMERG (NASA), GLC-FCS30D, Global Flood Database, geoBoundaries and Natural Earth. Processed in Google Earth Engine.",
  story: ["Earth", "Observation", "Data", "Analysis", "Modelling", "Decision support"],
};
