// Shared shapes for everything under src/data. Components import these types,
// never the raw JSON, so a typo in the data shows up as a type error.

export type ProjectKind = "Research project" | "Thesis" | "Manuscript" | "Research direction";

export interface Place {
  name: string;
  lat: number;
  lon: number;
}

export interface Metric {
  value: string;
  label: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
}

export interface Project {
  slug: string;
  kind: ProjectKind;
  year: string;
  place: Place;
  title: string;
  short: string;
  theme: string;
  description: string;
  highlights: string[];
  repoUrl: string;
  liveUrl: string;
  image: string;
  gallery?: GalleryImage[];
  tags: string[];
  metrics: Metric[];
}

/** A question the work points at but has not answered yet. Kept apart from
 *  Project so a direction can never be mistaken for finished work. */
export interface Direction {
  id: string;
  kind: "Research direction";
  title: string;
  question: string;
  buildsOn: string[];
  methods: string[];
  data: string[];
}

export type ResearchStatus = "Core" | "Platform" | "Direction";

export interface ResearchArea {
  id: string;
  title: string;
  category: string;
  status: ResearchStatus;
  summary: string;
  methods: string[];
  data: string[];
  applications: string[];
  /** Slugs of the studies behind this area. Empty for a direction. */
  studies: string[];
}

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  status: string;
  year: string;
  manuscript?: string;
  doi?: string;
  studies: string[];
}

export interface Talk {
  role: string;
  period: string;
  detail: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  role: string;
  affiliation: string;
  tagline: string;
  location: string;
  email: string;
  availability: { status: string; detail: string };
  social: { github: string; linkedin: string; orcid: string };
  photo: string;
  about: string[];
  approach: Principle[];
  education: Education[];
  talks: Talk[];
}
