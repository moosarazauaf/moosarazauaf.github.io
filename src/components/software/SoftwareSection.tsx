import { useState } from "react";
import { ArrowUpRight, FolderGit2, Maximize2, Play } from "lucide-react";
import { earthsift as e } from "../../data/software";
import { track } from "../../lib/analytics";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import "./software.css";

/**
 * Earthsift, the web app in development. The live app is a full 3D globe,
 * so it is not loaded with the page: a still of a real result stands in its
 * frame, and the app starts inside that frame only when a visitor asks for
 * it. The portfolio stays fast for everyone who does not.
 */
export function SoftwareSection() {
  const [live, setLive] = useState(false);

  return (
    <SectionTransition id="earthsift" sceneKey="software" className="software" labelledBy="software-title">
      <span className="section-rule" aria-hidden="true" />
      <div className="shell software-inner">
        <RevealText className="software-head">
          <p className="meta" data-reveal>
            04 · Software
          </p>
          <SplitText as="h2" id="software-title" className="display" text={e.name} />
          <p className="software-status meta" data-reveal>
            <span className="pulse-dot" aria-hidden="true" /> {e.status}
          </p>
        </RevealText>

        <div className="software-grid">
          <div className="software-text">
            <p className="lead">{e.statement}</p>
            <p className="body">{e.summary}</p>
            <ol className="software-points">
              {e.points.map((p) => (
                <li key={p.title}>
                  <span>
                    <b>{p.title}.</b> {p.text}
                  </span>
                </li>
              ))}
            </ol>
            <div className="software-links">
              <a className="software-cta" href={e.url} target="_blank" rel="noopener" data-cursor="OPEN" onClick={() => track("software/open-earthsift")}>
                Open the live app <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a className="software-code meta" href={e.repo} target="_blank" rel="noopener" data-cursor="OPEN">
                <FolderGit2 size={14} strokeWidth={1.5} aria-hidden="true" /> Source on GitHub
              </a>
            </div>
          </div>

          <figure className="software-frame">
            <div className="software-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>moosarazauaf.github.io/earthsift</span>
            </div>
            <div className="software-screen" data-lenis-prevent>
              {live ? (
                <iframe src={e.url} title="Earthsift, running live" allow="fullscreen; clipboard-write" loading="lazy" />
              ) : (
                <button
                  type="button"
                  className="software-poster"
                  data-cursor="RUN"
                  onClick={() => {
                    setLive(true);
                    track("software/run-embedded");
                  }}
                >
                  <img src={`/${e.poster.src}`} alt={e.poster.alt} loading="lazy" decoding="async" />
                  <span className="software-play">
                    <Play size={18} strokeWidth={1.5} aria-hidden="true" /> Run it here
                  </span>
                </button>
              )}
            </div>
            <figcaption className="software-caption">
              {live ? (
                <>
                  Running live inside this page.{" "}
                  <a href={e.url} target="_blank" rel="noopener">
                    <Maximize2 size={12} strokeWidth={1.5} aria-hidden="true" /> Open full screen
                  </a>
                </>
              ) : (
                "The Live view: hazard stories from the past day of news, placed on the globe."
              )}
            </figcaption>
          </figure>
        </div>

        <ul className="software-shots">
          {e.shots.map((s) => (
            <li key={s.src}>
              <img src={`/${s.src}`} alt={s.caption} loading="lazy" decoding="async" />
              <span>{s.caption}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionTransition>
  );
}
