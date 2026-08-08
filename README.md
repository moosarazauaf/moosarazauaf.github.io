# moosarazauaf.github.io

Personal portfolio site for **Muhammad Moosa Raza** — geospatial environmental
research (remote sensing, carbon dynamics, Earth observation modelling).

Live at: **https://moosarazauaf.github.io** (once published — see [Deployment](#deployment)).

## Why plain HTML/CSS/JS, not Python

GitHub Pages (the free hosting used here) only serves **static files** — it can't run a
Python/Flask/Django server. A framework or build step would add dependencies for no
real benefit on a content-driven personal site, so this repo is plain HTML, CSS and
vanilla JS: zero build step, nothing to install, edit and push.

## Structure

```
index.html                 Page shell — header/nav + empty <section> containers
assets/
  css/
    variables.css           Ajrak blue/white theme tokens (colors, spacing, fonts)
    style.css                All layout & component styles
  js/
    main.js                  Fetches data/*.json and renders every section into index.html
  img/
    profile-placeholder.svg  Placeholder headshot — swap for a real photo
    projects/                Placeholder project images
    README.md                Exact steps to swap in real images
data/
  profile.json              Bio, education, experience, skills, talks, certifications, social links
  projects.json              Project cards (title, description, GitHub link, image, tags)
  publications.json          Publications list (title, journal, status)
```

**All content lives in `data/*.json`.** `main.js` is the only file that reads it and
builds the page — you never need to touch HTML or CSS to update text.

## How to update content

| I want to... | Edit this file |
|---|---|
| Change my bio, education, experience, skills, talks, certifications, or social links | `data/profile.json` |
| Add/edit/remove a project card | `data/projects.json` |
| Add/edit a publication | `data/publications.json` |
| Swap my photo or a project image | see `assets/img/README.md` |
| Change the color theme | `assets/css/variables.css` |

**Adding a new project** — append an object to `data/projects.json`:
```json
{
  "title": "New Project Name",
  "description": "One or two sentences.",
  "highlights": ["Key result 1", "Key result 2"],
  "repoUrl": "https://github.com/moosarazauaf/new-repo",
  "liveUrl": "",
  "image": "assets/img/projects/new-project.svg",
  "tags": ["Python", "GEE"]
}
```
Commit and push — no other changes needed.

## Local preview

Because `main.js` fetches the JSON files, opening `index.html` directly from disk
(`file://`) will fail in most browsers (CORS blocks local `fetch`). Serve it over HTTP
instead, from this folder, e.g.:

```bash
npx serve .
# or
py -m http.server 8080
```

Then open the printed `localhost` URL.

## Deployment

This repo uses GitHub's special **user site** name (`moosarazauaf.github.io`), so once
it's public, GitHub Pages automatically serves `index.html` from the `main` branch at
`https://moosarazauaf.github.io` — no extra workflow or config needed.

## Tech

Plain HTML5, CSS3 (custom properties, CSS Grid/Flexbox), vanilla JavaScript (ES2017+,
`fetch`/`async`). No frameworks, no build tools, no dependencies.
