import { copy, profile } from "../../data/profile";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import "./about.css";

/**
 * Who is behind the work. The name at full size again, a portrait cut to a
 * golden rectangle, then the biography, the way of working and the degrees,
 * set as an editorial page rather than a résumé.
 */
export function AboutSection() {
  return (
    <SectionTransition id="about" sceneKey="about" className="about" labelledBy="about-title">
      <span className="section-rule" aria-hidden="true" />
      <div className="shell about-inner">
        <RevealText className="about-name">
          <p className="meta" data-reveal>
            About
          </p>
          <SplitText as="h2" id="about-title" className="display is-hero" text={"Muhammad\nMoosa\nRaza"} lines />
          <p className="about-role" data-reveal>
            {profile.role}. <span>{copy.seeking}.</span>
          </p>
        </RevealText>

        <div className="about-grid">
          <RevealText className="about-photo">
            <img src={`/${profile.photo}`} alt="Portrait of Muhammad Moosa Raza" loading="lazy" data-reveal />
            <p className="meta" data-reveal>
              {profile.location}
            </p>
          </RevealText>
          <RevealText className="about-bio">
            <p className="lead" data-reveal>
              {copy.aboutLead}
            </p>
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)} className="body" data-reveal>
                {p}
              </p>
            ))}
          </RevealText>
        </div>

        <div className="about-cols">
          <RevealText className="about-block">
            <h3 className="meta" data-reveal>
              How I work
            </h3>
            <ol className="principles">
              {profile.approach.map((a, i) => (
                <li key={a.title} data-reveal>
                  <span className="meta num">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <b>{a.title}.</b> {a.description}
                  </span>
                </li>
              ))}
            </ol>
          </RevealText>
          <RevealText className="about-block">
            <h3 className="meta" data-reveal>
              Education
            </h3>
            <ol className="education">
              {profile.education.map((e) => (
                <li key={e.degree} data-reveal>
                  <p className="edu-inst">{e.institution}</p>
                  <p className="edu-degree">{e.degree}</p>
                  {e.period && <p className="meta">{e.period}</p>}
                  {e.details.map((d) => (
                    <p key={d} className="edu-detail">
                      {d}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          </RevealText>
        </div>
      </div>
    </SectionTransition>
  );
}
