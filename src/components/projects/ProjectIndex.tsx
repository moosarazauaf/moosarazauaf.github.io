import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { setFlipOrigin } from "../../animations/projectAnimations";
import { THEME_COLOR, projects } from "../../data/projects";
import { Abbr } from "../ui/Abbr";

const THEMES = ["All", ...new Set(projects.map((p) => p.theme))];

/**
 * Table 1: the evidence, set the way a paper would set it. One row per study,
 * with what it is built on, how the result was checked, and the headline
 * number, so a reader can judge the work before opening anything. Each row
 * opens the full study and links to its repository.
 */
export function ProjectIndex({ onOpen }: { onOpen: (slug: string) => void }) {
  const [theme, setTheme] = useState("All");
  const list = useMemo(() => projects.filter((p) => theme === "All" || p.theme === theme), [theme]);

  return (
    <div className="pindex" id="evidence">
      <div className="pindex-head">
        <div>
          <p className="meta">Table 1</p>
          <h3 className="h3">The twelve studies: data, validation and result</h3>
        </div>
        <div className="pindex-filters" role="group" aria-label="Filter the studies by theme">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${t === theme ? "is-on" : ""}`}
              aria-pressed={t === theme}
              onClick={() => setTheme(t)}
            >
              {t !== "All" && <i className="theme-dot" style={{ background: THEME_COLOR[t] }} aria-hidden="true" />}
              {t}
              <span className="chip-n num">{t === "All" ? projects.length : projects.filter((p) => p.theme === t).length}</span>
            </button>
          ))}
        </div>
      </div>

      <table className="ptable">
        <caption className="visually-hidden">
          The twelve studies, with the data each is built on, how each result was checked, and its headline result.
        </caption>
        <thead>
          <tr className="meta">
            <th scope="col">No.</th>
            <th scope="col">Study and finding</th>
            <th scope="col">Data and period</th>
            <th scope="col">How it was checked</th>
            <th scope="col">Headline result</th>
            <th scope="col">Code</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => {
            const n = projects.indexOf(p) + 1;
            return (
              <tr
                key={p.slug}
                style={{ boxShadow: `inset 3px 0 0 ${THEME_COLOR[p.theme]}` }}
                data-cursor="VIEW"
                onClick={(e) => {
                  if ((e.target as Element).closest("a[target]")) return;
                  setFlipOrigin(e.currentTarget);
                  onOpen(p.slug);
                }}
              >
                <td className="meta num" data-label="No.">
                  {String(n).padStart(2, "0")}
                </td>
                <th scope="row" data-label="Study">
                  <a
                    className="ptable-title"
                    href={`#project/${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFlipOrigin(e.currentTarget.closest("tr"));
                      onOpen(p.slug);
                    }}
                  >
                    {p.title}
                  </a>
                  <span className="ptable-theme meta">
                    <i className="theme-dot" style={{ background: THEME_COLOR[p.theme] }} aria-hidden="true" />
                    {p.theme}
                  </span>
                  <span className="ptable-finding">
                    <Abbr>{p.finding}</Abbr>
                  </span>
                </th>
                <td data-label="Data and period">
                  <Abbr>{p.evidence}</Abbr>
                </td>
                <td data-label="How it was checked">
                  <Abbr>{p.check}</Abbr>
                </td>
                <td className="ptable-result" data-label="Headline result">
                  <b className="num">{p.metrics[0].value}</b>
                  <span className="meta">{p.metrics[0].label}</span>
                </td>
                <td data-label="Code">
                  <a className="ptable-code" href={p.repoUrl} target="_blank" rel="noopener" data-cursor="OPEN" aria-label={`Repository for ${p.short}`}>
                    GitHub <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="ptable-note meta">
        Every figure in this table comes from the study it names, where the method, the data exports and the code are public. Select
        a row for the full study.
      </p>
    </div>
  );
}
