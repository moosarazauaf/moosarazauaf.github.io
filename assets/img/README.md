# Images

These are placeholders — replace them with real files, same filenames (or update the
path in the matching `data/*.json` file if you rename them).

| Placeholder | Replace with | Referenced from |
|---|---|---|
| `profile-placeholder.svg` | Your headshot (`profile.jpg`/`.png`, roughly square, ≥ 400×400px) | `data/profile.json` → `"photo"` |
| `projects/lulc-placeholder.svg` | A screenshot/map from the LULC project | `data/projects.json` → first project's `"image"` |
| `projects/flood-placeholder.svg` | A screenshot/map from the Flood Monitor project | `data/projects.json` → second project's `"image"` |

**To swap an image:**
1. Drop the new file into this folder (e.g. `assets/img/profile.jpg`).
2. Update the matching `"photo"` or `"image"` path in `data/profile.json` /
   `data/projects.json` to point at the new filename.
3. Commit and push — no HTML/CSS changes needed.

**Adding a new project image:** same pattern — add the file under
`assets/img/projects/`, add a new object to `data/projects.json` with `"image"`
pointing at it.
