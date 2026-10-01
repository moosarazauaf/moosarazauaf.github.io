import { ArrowUpRight } from "lucide-react";
import { bySlug } from "../../data/projects";
import { publications, researchAreaOf, talks } from "../../data/publications";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import "./publications.css";

/**
 * An editorial list, not cards. Each manuscript shows its status exactly as
 * recorded; there is no DOI yet, so a row opens the study it is built on
 * rather than a link that does not exist. Talks follow as a second field.
 */
export function PublicationsSection({ onOpenStudy }: { onOpenStudy: (slug: string) => void }) {
  return (
    <SectionTransition id="publications" sceneKey="publications" className="pubs" labelledBy="pubs-title">
      <span className="section-rule" aria-hidden="true" />
      <div className="shell pubs-inner">
        <RevealText className="pubs-head">
          <p className="meta" data-reveal>
            06 · Decision support
          </p>
          <SplitText as="h2" id="pubs-title" className="display" text="Publications" />
        </RevealText>

        <div className="pubs-field">
          <h3 className="meta pubs-group">Manuscripts</h3>
          <ol className="pubs-list">
            {publications.map((p) => {
              const study = p.studies[0] ? bySlug(p.studies[0]) : undefined;
              const href = p.doi ? `https://doi.org/${p.doi}` : study ? `#project/${study.slug}` : undefined;
              return (
                <li key={p.title}>
                  <a
                    className="pub"
                    href={href}
                    data-cursor="OPEN"
                    {...(p.doi ? { target: "_blank", rel: "noopener" } : {})}
                    onClick={(e) => {
                      if (p.doi || !study) return;
                      e.preventDefault();
                      onOpenStudy(study.slug);
                    }}
                  >
                    <span className="pub-year meta num">{p.year}</span>
                    <span className="pub-main">
                      <span className="pub-authors">
                        {p.authors} ({p.year})
                      </span>
                      <span className="pub-title">{p.title}</span>
                      <span className="pub-meta meta">
                        <span>{p.journal}</span>
                        <span className={`pub-status is-${p.status.toLowerCase().replace(/\s+/g, "-")}`}>{p.status}</span>
                        <span>{researchAreaOf(p)}</span>
                        {p.manuscript && <span>{p.manuscript}</span>}
                        {study && <span>Built on: {study.short}</span>}
                      </span>
                    </span>
                    <ArrowUpRight className="pub-arrow" size={22} strokeWidth={1.25} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ol>

          <h3 className="meta pubs-group">Talks</h3>
          <ol className="pubs-list is-talks">
            {talks.map((t) => (
              <li key={t.role}>
                <div className="pub">
                  <span className="pub-year meta num">{t.period.replace(/\D*(\d{4}).*/, "$1")}</span>
                  <span className="pub-main">
                    <span className="pub-title">{t.role}</span>
                    <span className="pub-meta meta">
                      <span>{t.detail}</span>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionTransition>
  );
}
