import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { setFlipOrigin } from "../../animations/projectAnimations";
import { FEATURED_COVER, FEATURED_TITLE } from "../../data/projects";
import type { Project } from "../../data/types";
import { publications } from "../../data/publications";
import { scene } from "../../three/sceneState";

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
  reverse?: boolean;
  onOpen: (slug: string) => void;
}

/**
 * A study as a scene rather than a card: a large image and its title, with
 * the proof number set big beside it. Hovering drifts the image toward the
 * pointer, shifts the title and brings up the metadata.
 */
export function ProjectScene({ project: p, index, featured = false, reverse = false, onOpen }: Props) {
  const img = useRef<HTMLImageElement>(null);
  const pub = publications.find((x) => x.studies.includes(p.slug));
  const status = pub ? `Manuscript ${pub.status.toLowerCase()}` : null;

  const onMove = (e: React.PointerEvent) => {
    if (scene.reducedMotion || !img.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    img.current.style.setProperty("--px", `${(-x * 3).toFixed(2)}%`);
    img.current.style.setProperty("--py", `${(-y * 3).toFixed(2)}%`);
  };
  const onLeave = () => {
    img.current?.style.setProperty("--px", "0%");
    img.current?.style.setProperty("--py", "0%");
  };
  const open = () => {
    setFlipOrigin(img.current?.parentElement ?? null);
    onOpen(p.slug);
  };

  return (
    <article className={`pscene ${featured ? "is-featured" : reverse ? "is-reverse" : ""}`}>
      <a
        className="pscene-media"
        href={`#project/${p.slug}`}
        data-cursor="VIEW"
        data-parallax
        aria-label={`Open the study: ${p.title}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      >
        <img ref={img} src={`/${featured ? FEATURED_COVER : p.image}`} alt="" loading="lazy" decoding="async" />
      </a>
      <div className="pscene-text">
        <p className="meta pscene-kind">
          <span className="num">{String(index + 1).padStart(2, "0")}</span>
          <span>{p.kind}</span>
          {status && <span className="pscene-status">{status}</span>}
        </p>
        <h3 className="pscene-title">
          <a
            href={`#project/${p.slug}`}
            data-cursor="VIEW"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            {featured ? FEATURED_TITLE : p.title}
          </a>
        </h3>
        {!featured && <p className="pscene-finding">{p.finding}</p>}
        <p className="pscene-metric">
          <span className="num">{p.metrics[0].value}</span>
          <span className="meta">{p.metrics[0].label}</span>
        </p>
        <ul className="pscene-meta meta">
          <li>{p.year}</li>
          <li>{p.theme}</li>
          {p.tags
            .filter((t) => t !== "Python")
            .slice(0, featured ? 5 : 3)
            .map((t) => (
              <li key={t}>{t}</li>
            ))}
        </ul>
        {featured && <p className="body pscene-desc">{p.description}</p>}
        <span className="pscene-open meta" aria-hidden="true">
          Enter the study <ArrowUpRight size={14} strokeWidth={1.5} />
        </span>
      </div>
    </article>
  );
}
