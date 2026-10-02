import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { setFlipOrigin } from "../../animations/projectAnimations";
import { projects } from "../../data/projects";
import { useFinePointer } from "../../hooks/useMediaQuery";
import { ProjectPreview } from "./ProjectPreview";

const THEMES = ["All", ...new Set(projects.map((p) => p.theme))];

/**
 * All twelve studies as an editorial index: number, title, theme and the
 * one number that proves it. A supervisor can cut straight to their own
 * field with the theme filter; on a mouse, the study's image trails the
 * pointer down the list.
 */
export function ProjectIndex({ onOpen }: { onOpen: (slug: string) => void }) {
  const [theme, setTheme] = useState("All");
  const [hover, setHover] = useState<string | null>(null);
  const fine = useFinePointer();
  const list = useMemo(() => projects.filter((p) => theme === "All" || p.theme === theme), [theme]);

  return (
    <div className="pindex">
      <div className="pindex-head">
        <h3 className="h3">All twelve studies</h3>
        <div className="pindex-filters" role="group" aria-label="Filter the studies by theme">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${t === theme ? "is-on" : ""}`}
              aria-pressed={t === theme}
              onClick={() => setTheme(t)}
            >
              {t}
              <span className="chip-n num">{t === "All" ? projects.length : projects.filter((p) => p.theme === t).length}</span>
            </button>
          ))}
        </div>
      </div>
      <ol className="pindex-list" onPointerLeave={() => setHover(null)}>
        {list.map((p) => {
          const n = projects.indexOf(p) + 1;
          return (
            <li key={p.slug}>
              <a
                className="pindex-row"
                href={`#project/${p.slug}`}
                data-cursor="VIEW"
                onPointerEnter={() => setHover(p.slug)}
                onFocus={() => setHover(null)}
                onClick={(e) => {
                  e.preventDefault();
                  setFlipOrigin(e.currentTarget);
                  onOpen(p.slug);
                }}
              >
                <span className="pindex-n meta num">{String(n).padStart(2, "0")}</span>
                <span className="pindex-title">
                  {p.title}
                  <span className="pindex-finding">{p.finding}</span>
                </span>
                <span className="pindex-theme meta">{p.theme}</span>
                <span className="pindex-metric">
                  <b className="num">{p.metrics[0].value}</b>
                  <span className="meta">{p.metrics[0].label}</span>
                </span>
                <ArrowUpRight className="pindex-arrow" size={18} strokeWidth={1.25} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
      {fine && <ProjectPreview slug={hover} />}
    </div>
  );
}
