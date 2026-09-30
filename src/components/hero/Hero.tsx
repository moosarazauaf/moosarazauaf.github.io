import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDownRight, Move } from "lucide-react";
import { heroExit, heroIntro } from "../../animations/heroAnimations";
import { copy, profile } from "../../data/profile";
import { scrollToTarget } from "../../lib/scroll";
import { scene } from "../../three/sceneState";
import { SplitText } from "../ui/SplitText";
import { StaticEarth } from "../ui/StaticEarth";
import { DragSurface } from "./DragSurface";
import "./hero.css";

interface Props {
  ready: boolean;
  webgl: boolean;
}

/**
 * The first viewport. The name is HTML, set in difference blend so wherever
 * the globe passes behind it the letters invert; the globe itself is the
 * shared WebGL scene, placed at the golden point on the right.
 */
export function Hero({ ready, webgl }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !ready) return;
    const release = (k: "earth" | "sat") => () =>
      gsap.to(scene.intro, { [k]: 1, duration: scene.reducedMotion ? 0.01 : 1.618, ease: "power2.out" });
    if (scene.reducedMotion) {
      gsap.set(el, { autoAlpha: 1 });
      release("earth")();
      release("sat")();
      return;
    }
    const intro = heroIntro(el, release("earth"), release("sat"));
    const exit = heroExit(el);
    // If frames are being withheld (a throttled or backgrounded tab), finish
    // the opening outright rather than leave the name hidden.
    const safety = window.setTimeout(() => {
      if (intro.progress() < 1) intro.progress(1);
    }, 4236);
    return () => {
      window.clearTimeout(safety);
      intro.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    };
  }, [ready]);

  return (
    <section ref={root} id="top" className="hero scene" data-scene="hero" aria-labelledby="hero-name">
      {webgl ? <DragSurface className="hero-drag" /> : <StaticEarth className="hero-static" />}

      <div className="hero-top shell">
        <p className="meta" data-intro="meta">
          {copy.descriptor[0]}
        </p>
        <p className="meta hero-coords" data-intro="meta">
          30.96° N · 70.94° E · {profile.location}
        </p>
      </div>

      <div className="hero-body shell">
        <SplitText as="h1" id="hero-name" className="display is-hero hero-name" text={"Muhammad\nMoosa\nRaza"} lines />

        <div className="hero-side">
          <ul className="hero-descriptor meta" data-intro="meta">
            {copy.descriptor.slice(1).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="lead hero-tagline" data-intro="late">
            {profile.tagline}.
          </p>
          <dl className="hero-proof" data-intro="late">
            {copy.heroProof.map((p) => (
              <div key={p.label}>
                <dt className="num">{p.value}</dt>
                <dd className="meta">{p.label}</dd>
              </div>
            ))}
          </dl>
          <a
            className="hero-seeking"
            href="#contact"
            data-intro="late"
            data-cursor="TALK"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
          >
            <span className="pulse-dot" aria-hidden="true" />
            {copy.seeking}
            <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>

      {webgl && (
        <p className="hero-drag-hint meta" data-intro="late" aria-hidden="true">
          <Move size={14} strokeWidth={1.5} /> Drag to explore
        </p>
      )}
      <button
        type="button"
        className="hero-cue meta"
        data-intro="late"
        onClick={() => scrollToTarget("#research")}
        data-cursor="SCROLL"
      >
        <span className="hero-cue-line" aria-hidden="true" />
        Scroll to enter the system
      </button>
    </section>
  );
}
