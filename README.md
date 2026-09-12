# moosarazauaf.github.io

Personal research site for **Muhammad Moosa Raza**. Earth observation: floods,
drought, land-system change, and the reliability of the methods behind them.

Live at **https://moosarazauaf.github.io**

## Why plain HTML/CSS/JS

GitHub Pages serves **static files only**, so it cannot run Python, Flask or Django.
A framework or build step would add dependencies for no real benefit on a
content-driven personal site, so this is plain HTML, CSS and vanilla JS: nothing to
install, no build, edit and push.

## Structure

```
index.html                  Page shell: nav + empty <section> containers, in page order
assets/
  css/
    variables.css           Design tokens: brand palette, golden-ratio type & spacing,
                            motion, and the light/dark theme maps
    style.css               All layout and component styles
  js/
    main.js                 Reads data/*.json and renders every section. Also runs the
                            carousel, scroll-spy, progress bar, parallax and reveals
  img/
    profile.jpg             Headshot
    map-texture.jpg         Cropped QGIS export used as the hero plate and page wash
    projects/               Project card images
    README.md               Which image goes where, and how to swap one
data/
  profile.json              Everything about you (see fields below)
  projects.json             The project carousel
  publications.json         Publications list
  lahore-lulc.json          Year-by-year areas and carbon for the land-change scrubber
  pakistan-districts.geojson  District outlines joined to the national carbon account
scripts/
  build_pakistan_districts.py  Rebuilds that geojson from the live app's own tables
.github/workflows/pages.yml Deploy workflow
```

**All content lives in `data/*.json`.** `main.js` is the only file that reads it, so
updating text never means touching HTML or CSS.

### Page order and the two tabbed sections

`index.html` is ten sections: hero, stats, about, projects, **explore**,
publications, audit, research, **background**, contact. The two bold ones are tab
groups built by `renderExplore()` and `renderBackground()`; the renderers for the
panels inside them still find their own node by id, exactly as before.

A closed panel is `hidden`, so it takes up no height. That is what keeps the page
at roughly eight screens instead of twelve. Two consequences worth remembering:

- Renderers that can end up inside a panel call `panelHeading()` rather than
  `heading()`. It returns nothing when its target node sits in a panel, because
  the tab label already names the content.
- Anything that measures itself needs the `panelshown` event. Leaflet sizes a
  hidden container to zero, so both maps listen for it and remeasure.

## How to update content

| I want to… | Edit |
|---|---|
| Bio, availability, research interests, education, experience, skills, talks, certifications, social links | `data/profile.json` |
| Add / edit / remove a project | `data/projects.json` |
| Add / edit a publication | `data/publications.json` |
| Swap the headshot or a project image | see `assets/img/README.md` |
| Colours, type scale, spacing, motion | `assets/css/variables.css` |

### `data/profile.json` fields

Beyond the obvious ones:

| Field | Drives |
|---|---|
| `availability` | The "Seeking a PhD position" notice in the hero and the footer |
| `about` | The Research Statement |
| `methodsAudit` | The "Numbers That Hold Up" figure: four before/after pairs |
| `researchInterests` | The Research Interests cards (`icon` picks a built-in SVG) |
| `approach` | The "How I Work" cards |
| `role`, `tagline` | The hero display text |

### Adding a project

Append to `data/projects.json`. Only `title`, `description`, `repoUrl` and `image`
are required:

```json
{
  "title": "New Study, District, Pakistan",
  "description": "One or two sentences.",
  "metrics": [
    { "value": "0.94", "label": "F1 score" },
    { "value": "120 km²", "label": "area mapped" }
  ],
  "highlights": ["Longer method notes, collapsed behind a disclosure"],
  "repoUrl": "https://github.com/moosarazauaf/new-repo",
  "liveUrl": "",
  "image": "assets/img/projects/new-project.jpg",
  "gallery": [
    { "src": "assets/img/projects/new-project.jpg", "caption": "Main figure" },
    { "src": "assets/img/projects/new-fig2.jpg", "caption": "Second figure" }
  ],
  "tags": ["Sentinel-1 SAR", "Python"]
}
```

- `metrics` become the stat tiles at the top of the card. Two or three works best.
- `highlights` collapse into a closed "How it was built" disclosure, so length is cheap.
- `gallery` is optional. With more than one entry the card grows a thumbnail strip;
  without it the card just shows `image`.

## Two things that will bite you

**1. Bump `?v=` when you edit CSS or JS.**
`index.html` loads them as `style.css?v=36`, `main.js?v=36`. Browsers cache these
aggressively, so if you change a stylesheet without bumping the number, returning
visitors keep the old one. Increment all three references together. The JSON files
are fetched with `cache: "no-cache"` and need no such step, which is why content
edits appear immediately.

**2. Two brand colours cannot be used for text.**
Measured against the paper background, sage `#7CA982` is 2.45:1 and gold `#C2A83E`
is 2.15:1, both under the 3:1 minimum, and against each other they separate by
only ΔE 11, below the 15 needed to tell apart with full colour vision. They are for
fills, borders and decoration. Use `--gold-readable` (#8A7420, 4.57:1) or
`--sage-bright` (#9DC4A3) when a colour has to be read. Every text pair currently in
`variables.css` was checked to WCAG AA in both themes.

## Design system

- **Golden ratio.** `--phi: 1.618` drives spacing (`1/φ, 1, φ, φ², φ³`) and the type
  scale. Display sizes climb by φ; text sizes use √φ (1.272), because a full φ step
  between body and lead is too coarse to read as a scale. The hero rows and the
  about split are both 1 : 1.618.
  Note: `fr` cannot be multiplied inside `calc()`, so those grids use literal
  `1.618fr` values, because `calc(1fr * var(--phi))` parses as invalid and is dropped.
- **Motion.** Short and small by default (`--dur` 0.25s, 2px hovers), with a longer
  `--dur-cine` reserved for the hero entrance and section reveals. Everything is
  disabled under `prefers-reduced-motion`, and any effect that starts an element at
  `opacity: 0` has a fallback that turns it on regardless.

## Local preview

`main.js` fetches the JSON, so opening `index.html` from disk (`file://`) fails on
CORS. Serve over HTTP from this folder:

```bash
py -m http.server 8080
```

Then open the printed `localhost` URL.

## Deployment

Pushing to **`master`** triggers `.github/workflows/pages.yml`, which builds and
deploys to GitHub Pages. Takes about a minute.

(The legacy Jekyll-style Pages build never ran on this repo. It accepted the config
and silently produced no builds, which is why deployment goes through an explicit
Actions workflow.)

## Tech

HTML5, CSS3 (custom properties, Grid, Flexbox, `color-mix`), vanilla JavaScript
(ES2017+, `fetch`, `IntersectionObserver`). No frameworks and no build tools.

The one third-party dependency is Leaflet, and it is loaded from a CDN with an SRI
hash only when the district map scrolls within a screen of the viewport. If it fails
to load, that section falls back to a link to the live Streamlit app and the rest of
the page is unaffected.

## Rebuilding the district map

`data/pakistan-districts.geojson` is generated, not hand-edited:

```bash
python scripts/build_pakistan_districts.py
```

It imports `analysis.py` from the sibling `pakistan-lulc-carbon` checkout and runs
the same `district_table()` the live app uses, so the map cannot drift away from the
app. District outlines come from geoBoundaries and are cached beside the script.
The two sources name districts differently, so the script carries an alias table;
anything still unmatched is written without a value and drawn as no data rather than
guessed at.
