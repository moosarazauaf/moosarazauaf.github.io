import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight, Check, Copy, FolderGit2, X } from "lucide-react";
import { expandFrom } from "../../animations/projectAnimations";
import { FEATURED, FEATURED_COVER, bySlug, linkedStudies, projects, splitTags } from "../../data/projects";
import { publications } from "../../data/publications";
import { lockScroll } from "../../lib/scroll";
import { scene } from "../../three/sceneState";
import { Abbr } from "../ui/Abbr";
import "./overlay.css";

interface Props {
  slug: string | null;
  onClose: () => void;
  onOpen: (slug: string) => void;
}

/**
 * A study, entered rather than navigated to. The image opens out of the spot
 * it was clicked from and fills the frame, then the account of the study
 * arrives beneath it. The URL carries #project/<slug>, Escape and the back
 * button close it, and focus returns to wherever it came from.
 */
export function ProjectOverlay({ slug, onClose, onOpen }: Props) {
  const p = slug ? bySlug(slug) : undefined;
  const root = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const [cited, setCited] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!p || !el) return;
    el.scrollTop = 0;
    const frame = el.querySelector<HTMLElement>(".ov-media");
    const img = el.querySelector<HTMLElement>(".ov-media img");
    const rest = [...el.querySelectorAll("[data-ov]")];
    if (!frame || !img) return;
    const tl = expandFrom(frame, img, rest, scene.reducedMotion);
    return () => {
      tl.kill();
    };
  }, [p]);

  useEffect(() => {
    if (!p) return;
    if (!returnTo.current) returnTo.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    root.current?.querySelector<HTMLElement>(".ov-close")?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [p, onClose]);

  useEffect(() => {
    if (p) return;
    lockScroll(false);
    returnTo.current?.focus({ preventScroll: true });
    returnTo.current = null;
  }, [p]);

  if (!p) return null;

  const { methods, tools } = splitTags(p);
  const linked = linkedStudies(p).slice(0, 6);
  const pub = publications.find((x) => x.studies.includes(p.slug));
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  // The thesis opens onto the same strip it was entered from; every other
  // study's lead image is a figure, shown whole rather than cropped.
  const cover = p.slug === FEATURED;
  const hero = cover ? FEATURED_COVER : p.image;
  const gallery = (p.gallery ?? []).filter((g) => g.src !== hero);
  // The year the work was released: the last year of its period.
  const citation = `Raza, M. M. (${p.year.slice(-4)}). ${p.title} [Code and data]. GitHub. ${p.repoUrl}`;
  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCited(true);
      window.setTimeout(() => setCited(false), 2618);
    } catch {
      /* Clipboard blocked: the citation is on the page to select by hand. */
    }
  };
  const close = () => {
    if (!root.current || scene.reducedMotion) return onClose();
    gsap.to(root.current, { opacity: 0, y: -24, duration: 0.382, ease: "power2.in", onComplete: onClose });
  };

  return (
    <div
      ref={root}
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ov-title"
      data-lenis-prevent
      key={p.slug}
    >
      <button type="button" className="ov-close" onClick={close} data-cursor="CLOSE">
        <span className="meta">Close</span>
        <X size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <div className={`ov-media ${cover ? "" : "is-plate"}`}>
        <img src={`/${hero}`} alt={cover ? "Lahore District's land cover, epoch by epoch" : p.gallery?.[0]?.caption ?? p.title} />
      </div>

      <header className="ov-head shell">
        <p className="meta" data-ov>
          {p.kind} · {p.theme} · {p.year} · {p.place.name}
          {pub && <span className="ov-pub"> · Manuscript {pub.status.toLowerCase()}, {pub.journal}</span>}
        </p>
        <h2 id="ov-title" className="ov-title" data-ov>
          {p.title}
        </h2>
        <p className="ov-finding" data-ov>
          <Abbr>{p.finding}</Abbr>
        </p>
      </header>

      <div className="ov-body shell golden">
        <div className="ov-main" data-ov>
          <h3 className="meta ov-label">Abstract</h3>
          <p className="lead">
            <Abbr>{p.description}</Abbr>
          </p>
          <h3 className="meta ov-sub">Key results</h3>
          <ul className="ov-highlights">
            {p.highlights.map((h) => (
              <li key={h}>
                <span>
                  <Abbr>{h}</Abbr>
                </span>
              </li>
            ))}
          </ul>
          <h3 className="meta ov-sub">How the result was checked</h3>
          <p className="ov-check">
            <Abbr>{p.check}</Abbr>
          </p>
          {p.basis && p.basis.length > 0 && (
            <>
              <h3 className="meta ov-sub">Assumptions and limitations</h3>
              <ul className="ov-basis">
                {p.basis.map((b) => (
                  <li key={b}>
                    <Abbr>{b}</Abbr>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="ov-side" data-ov>
          <dl className="ov-metrics">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <dt className="num">{m.value}</dt>
                <dd className="meta">{m.label}</dd>
              </div>
            ))}
          </dl>
          <div className="ov-list">
            <p className="meta">Data and period</p>
            <p>{p.evidence}</p>
          </div>
          {[
            ["Methods", methods],
            ["Tools", tools],
          ].map(([label, items]) =>
            (items as string[]).length ? (
              <div key={label as string} className="ov-list">
                <p className="meta">{label as string}</p>
                <p>{(items as string[]).join(" · ")}</p>
              </div>
            ) : null
          )}
          <div className="ov-list">
            <p className="meta">Reproducibility</p>
            <p>The code, the data exports and a written account of the method are public.</p>
          </div>
          <div className="ov-links">
            <a className="ov-link" href={p.repoUrl} target="_blank" rel="noopener" data-cursor="OPEN">
              <FolderGit2 size={16} strokeWidth={1.5} aria-hidden="true" /> Repository on GitHub
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
            {p.liveUrl && (
              <a className="ov-link" href={p.liveUrl} target="_blank" rel="noopener" data-cursor="OPEN">
                Live app <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="ov-cite">
            <p className="meta">Cite as</p>
            <p className="ov-cite-text">{citation}</p>
            <button type="button" className="ov-cite-copy meta" onClick={copyCitation} data-cursor="COPY">
              {cited ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
              <span aria-live="polite">{cited ? "Copied" : "Copy citation"}</span>
            </button>
          </div>
        </aside>
      </div>

      {gallery.length > 0 && (
        <div className="ov-gallery shell" data-ov>
          {gallery.map((g, i) => (
            <figure key={g.src}>
              <a href={`/${g.src}`} target="_blank" rel="noopener" data-cursor="ENLARGE" aria-label={`Open figure ${i + 1} at full size`}>
                <img src={`/${g.src}`} alt={g.caption} loading="lazy" />
              </a>
              <figcaption>
                <b className="meta">Fig. {i + 1}</b> {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {linked.length > 0 && (
        <div className="ov-linked shell" data-ov>
          <p className="meta">Connected studies</p>
          <div className="rdetail-chips">
            {linked.map((l) => {
              const q = bySlug(l.slug);
              return q ? (
                <button key={l.slug} type="button" className="chip" title={l.why} onClick={() => onOpen(l.slug)} data-cursor="VIEW">
                  {q.short}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      <button type="button" className="ov-next shell" onClick={() => onOpen(next.slug)} data-cursor="NEXT">
        <span className="meta">Next study</span>
        <span className="ov-next-title">
          {next.title} <ArrowRight size={28} strokeWidth={1.25} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
