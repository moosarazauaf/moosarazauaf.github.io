/** Software in active development. Every line here restates the project's own
 *  README; nothing is claimed that the app does not do. */
export const earthsift = {
  name: "Earthsift",
  status: "In development · public alpha",
  statement: "See what is changing on Earth, with the evidence behind every number.",
  summary:
    "A 3D globe in the browser that puts four decades of open satellite imagery, live hazard feeds and a reproducible analysis engine in one place. Ask what changed at any place on Earth and get an answer that names the scenes, the method and the limits behind it.",
  url: "https://moosarazauaf.github.io/earthsift/",
  repo: "https://github.com/moosarazauaf/earthsift",
  points: [
    {
      title: "Runs on the visitor's own computer",
      text: "Change detection, flood mapping and surface-water tracking read Landsat, Sentinel-1 and Sentinel-2 straight from the public archive in a web worker. The analyses need no account, key or server.",
    },
    {
      title: "Evidence with every number",
      text: "Each result lists the scenes, cloud mask, formula and threshold, how far the answer moves if the threshold is off, and what the method cannot see. Values are labelled observed, derived, modelled or estimated.",
    },
    {
      title: "A flood rating scored on a real flood",
      text: "Against Earthsift's own radar map of the 2022 Pakistan floods, on 94 random 10 km squares, the rating flagged 21 of 24 flooded squares (recall 88%, 95% interval 69 to 96%), and 21 of the 26 it flagged did flood (precision 81%, 62 to 91%).",
    },
    {
      title: "An assistant that cannot invent a number",
      text: "Ask Sentri in plain words, such as \"Is Sukkur safe?\". A language model chooses the action; Earthsift's own code runs it and writes the answer, so numbers, dates and checks never come from the model.",
    },
  ],
  poster: {
    src: "img/earthsift-live.webp",
    alt: "Earthsift Live view: a 3D globe with hazard badges for floods, earthquakes, drought and storms, and a side panel of hazard headlines from the past 24 hours",
  },
  shots: [
    { src: "img/earthsift-swipe.webp", caption: "Lahore, Landsat 1993 against 2025 under a swipe divider" },
    { src: "img/earthsift-risk.webp", caption: "The risk check for Nowshera, with each hazard rated and explained" },
    { src: "img/earthsift-carbon.webp", caption: "Carbon stock of Layyah from Sentri, with ranges and a chart" },
  ],
};
