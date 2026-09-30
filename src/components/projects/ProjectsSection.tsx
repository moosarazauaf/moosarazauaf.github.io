import { useEffect, useRef } from "react";
import { parallaxImages } from "../../animations/projectAnimations";
import { copy } from "../../data/profile";
import { FEATURED, SELECTED, bySlug, directions } from "../../data/projects";
import { scene } from "../../three/sceneState";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectScene } from "./ProjectScene";
import "./projects.css";

/**
 * The work. The thesis leads as one large scene, four results follow as
 * scenes of their own, then the full index, and last the open questions
 * the work points at, labelled as directions so they are never read as
 * finished studies.
 */
export function ProjectsSection({ onOpen }: { onOpen: (slug: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || scene.reducedMotion) return;
    return parallaxImages(root.current);
  }, []);

  const featured = bySlug(FEATURED);
  const selected = SELECTED.map(bySlug).filter((p) => !!p);

  return (
    <SectionTransition id="projects" sceneKey="projects" className="projects" labelledBy="projects-title">
      <div ref={root} className="shell projects-inner">
        <RevealText className="projects-head">
          <p className="meta" data-reveal>
            04 · Analysis
          </p>
          <SplitText as="h2" id="projects-title" className="display" text="Projects" />
          <p className="lead" data-reveal>
            {copy.projectsIntro}
          </p>
        </RevealText>

        {featured && <ProjectScene project={featured} index={0} featured onOpen={onOpen} />}

        <div className="pscenes">
          {selected.map((p, i) => (
            <ProjectScene key={p.slug} project={p} index={i + 1} reverse={i % 2 === 1} onOpen={onOpen} />
          ))}
        </div>

        <ProjectIndex onOpen={onOpen} />

        <section className="directions" aria-labelledby="directions-title">
          <div className="directions-head">
            <p className="meta">Next</p>
            <h3 id="directions-title" className="h3">
              Questions the work is pointing at
            </h3>
            <p className="body">
              Not started, and not claimed as results. These are where I would take the methods above in a PhD.
            </p>
          </div>
          <ol className="directions-list">
            {directions.map((d) => (
              <li key={d.id} className="direction">
                <p className="meta">
                  <span className="tag-direction">{d.kind}</span>
                </p>
                <h4 className="direction-title">{d.title}</h4>
                <p className="direction-q">{d.question}</p>
                <p className="meta direction-builds">
                  Builds on{" "}
                  {d.buildsOn.map((s, i) => {
                    const p = bySlug(s);
                    return p ? (
                      <span key={s}>
                        <a
                          href={`#project/${s}`}
                          data-cursor="VIEW"
                          onClick={(e) => {
                            e.preventDefault();
                            onOpen(s);
                          }}
                        >
                          {p.short}
                        </a>
                        {i < d.buildsOn.length - 1 ? ", " : ""}
                      </span>
                    ) : null;
                  })}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </SectionTransition>
  );
}
