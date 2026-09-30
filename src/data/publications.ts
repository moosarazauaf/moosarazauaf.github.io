import raw from "./publications.json";
import profileRaw from "./profile.json";
import type { Profile, Publication, Talk } from "./types";

/** Manuscripts exactly as recorded: a status is shown as written and a DOI is
 *  only linked when one exists in the data. */
export const publications = raw as Publication[];

export const talks: Talk[] = (profileRaw as unknown as Profile).talks;

export const researchAreaOf = (p: Publication) =>
  /carbon|land/i.test(p.title) ? "Land systems" : /flood/i.test(p.title) ? "Floods" : "Remote sensing";
