# moosarazauaf.github.io

Research portfolio of **Muhammad Moosa Raza**, Earth observation researcher: floods,
drought and land change measured from satellites, over Pakistan.

Live at **https://moosarazauaf.github.io** · previous version at
**https://moosarazauaf.github.io/classic/**

## What it is

A single scrolling page that moves through one story, Earth → Observation → Data →
Analysis → Modelling → Decision support, with a WebGL globe as the camera's subject:

| Section | What happens |
|---|---|
| Intro | The name over a dotted globe turned to Pakistan. Drag to spin it. |
| Research | Seven research areas orbit the globe as real buttons. Select one and the camera moves aside for its detail. |
| Remote sensing | A real Sentinel-1 scene is "acquired" line by line as you scroll; instrument use is counted from the studies. |
| Projects | The thesis, four selected studies, an index of all twelve with a trailing preview, and two research directions clearly marked as not started. A study opens out of the image you clicked (`#project/<slug>`). |
| Data | The globe dives into Pakistan and hands over to a district map of real output from the national land and carbon account. |
| Publications, About, Contact | Editorial list, biography, and the one invitation the page makes. |

## Stack

React 19 · TypeScript (strict) · Vite · Three.js with React Three Fiber and drei ·
GSAP with ScrollTrigger · Lenis · d3-geo and world-atlas for outlines · Lucide icons.
No UI kit and no template. Fonts (Inter, JetBrains Mono) are self-hosted from npm.

## Structure

```
index.html                 Page shell, SEO and Open Graph tags
src/
  app/                     App composition and the #project/<slug> route
  components/              One folder per section, each with its own CSS
  data/                    ALL editable content (see below)
  three/                   Scene state, camera keyframes, shaders, geo helpers
  animations/              GSAP timelines: hero, scroll/camera, menu, projects
  hooks/                   Lenis, media queries, reduced motion, pointer, progress
  lib/                     Golden-ratio constants, scroll helpers
  styles/                  Tokens, type scale, shared animation CSS
public/
  img/                     Portrait, project figures, share card
  geo/                     District outlines joined to the national carbon account
  classic/                 The previous static site, served unchanged, not indexed
scripts/                   Rebuild the district geojson and the share card
```

## Editing content

Everything a visitor reads lives in `src/data/`:

- `profile.json`: name, role, bio, approach, education, talks, links
- `projects.json`: the twelve studies (title, metrics, highlights, images, place)
- `publications.json`: manuscripts, with status exactly as recorded. A DOI is only
  linked when one is present.
- `research.ts`: the seven research areas. `status: "Direction"` marks work that is
  planned, not done, and the page labels it that way.
- `projects.ts`: which studies are featured, and the research directions
- `profile.ts` (`copy`): short lines of page text that are not facts about the work

Counts on the page (studies per sensor, studies per theme) are computed from the
data, so they cannot drift from it.

## Proportions

Sizes, spacing, the column split, orbit radii, orbital speeds and timings all come
from the golden ratio (`src/lib/golden.ts`, and the tokens in
`src/styles/globals.css` and `typography.css`). Layouts split 61.8 / 38.2; the type
scale runs 0.786rem to 11.09rem in powers of φ; the globe's dots sit on a
golden-angle spiral.

## Accessibility and performance

- `prefers-reduced-motion`: no smooth scroll, no orbit or parallax, no custom cursor;
  the camera cuts instead of gliding, and all content is present without animation.
- Research areas, studies and map layers are real buttons and links, reachable by
  keyboard with visible focus. The menu traps focus and closes on Escape.
- One WebGL canvas for the whole page, rendered on demand and paused when nothing
  3D is on screen or the tab is hidden. DPR is capped, and drops on a slow GPU.
- Three.js loads as its own chunk after the page shell. Without WebGL the intro
  shows a static line-drawn globe and everything else works unchanged.

## Local development

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes the site to `dist/`.

## Deployment

Pushing to `master` runs `.github/workflows/pages.yml`, which builds the site and
publishes `dist/` to GitHub Pages. In the repository settings, Pages must be set
to deploy from **GitHub Actions**.

## Going back to the previous version

The static site this replaced is tagged `classic-v1` and kept on the `classic`
branch. It is also served, unchanged, at `/classic/`.

## Rebuilding the district map

```bash
python scripts/build_pakistan_districts.py
```

Reads the national app's own district tables (`../pakistan-lulc-carbon`) and the
geoBoundaries ADM2 outlines, and writes `public/geo/pakistan-districts.geojson`.
