# Images

| File | Used for | Referenced from |
|---|---|---|
| `profile-placeholder.svg` | Headshot — **still a placeholder**, swap for a real photo | `data/profile.json` → `"photo"` |
| `projects/lulc-2023.png` | LULC project card image (2023 classification map) | `data/projects.json` → LULC project's `"image"` |
| `projects/flood-placeholder.svg` | Flood Monitor project card — **still a placeholder** | `data/projects.json` → Flood Monitor project's `"image"` |

## Extra LULC/carbon figures (from the thesis, not currently used on the page)

These are available if you want to swap the LULC card image or extend the project
section with a small gallery later — none are wired into `data/projects.json` yet
except `lulc-2023.png`:

- `projects/lulc-1993.png`, `lulc-2003.png`, `lulc-2013.png` — the other three years of
  the LULC classification series
- `projects/builtup-expansion.png` — built-up area expansion map (1993–2023)
- `projects/vegetation-loss.png` — vegetation loss map (1993–2023)
- `projects/carbon-emission.png` — carbon stock change map (1993–2023)

To swap the LULC card image to one of these instead, just change
`data/projects.json` → first project's `"image"` to the new filename.

## To swap the headshot or Flood Monitor image

1. Drop the new file into this folder (e.g. `assets/img/profile.jpg`, or
   `assets/img/projects/flood-monitor.png`).
2. Update the matching `"photo"` (in `data/profile.json`) or `"image"` (in
   `data/projects.json`) path to point at the new filename.
3. Commit and push — no HTML/CSS changes needed.

**Adding a new project image:** same pattern — add the file under
`assets/img/projects/`, add a new object to `data/projects.json` with `"image"`
pointing at it.
