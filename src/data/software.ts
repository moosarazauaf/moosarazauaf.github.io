/** Software in active development. Every line here restates the project's own
 *  README; nothing is claimed that the app does not do. */
export const earthpulse = {
  name: "EarthPulse",
  status: "In development · public alpha",
  statement: "See what is changing on Earth, with the evidence behind every number.",
  summary:
    "A 3D globe in the browser that puts forty years of open satellite imagery, live hazard feeds and a reproducible analysis engine in one place. Ask what changed at any place on Earth and get an answer that names the scenes, the method and the limits behind it.",
  url: "https://moosarazauaf.github.io/earthpulse/",
  repo: "https://github.com/moosarazauaf/earthpulse",
  points: [
    {
      title: "Runs on the visitor's own computer",
      text: "Change detection, flood mapping and surface-water tracking read Landsat, Sentinel-1 and Sentinel-2 straight from the public archive in a web worker. No account, no key, no server.",
    },
    {
      title: "Evidence with every number",
      text: "Each result lists the scenes, cloud mask, formula and threshold, how far the answer moves if the threshold is off, and what the method cannot see. Values are labelled observed, derived, modelled or estimated.",
    },
    {
      title: "Live hazards and the news behind them",
      text: "GDACS alerts, NASA VIIRS fires, GloFAS flood forecasts and USGS earthquakes, with hazard stories from the news matched to agency records and the rain that led up to them.",
    },
    {
      title: "Forty years on one globe",
      text: "Annual Landsat and Sentinel-2 layers since 1984 in true colour, false colour and four spectral indices, compared with a swipe, blink or blend.",
    },
  ],
  poster: {
    src: "img/earthpulse-flood.webp",
    alt: "EarthPulse FloodLens result for the Indus at Layyah, 2022: newly flooded land in red beside the river in blue, with the flooded area and threshold sensitivity in the side panel",
  },
  shots: [
    { src: "img/earthpulse-swipe.webp", caption: "Lahore, Landsat 1993 against 2025 under a swipe divider" },
    { src: "img/earthpulse-news.webp", caption: "Hazard stories from the past day of news, placed on the globe" },
    { src: "img/earthpulse-change.webp", caption: "A change analysis with the scenes and method behind it" },
  ],
};
