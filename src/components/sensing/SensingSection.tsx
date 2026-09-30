import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { copy } from "../../data/profile";
import { bySlug, projects, sensorUse } from "../../data/projects";
import { useMobile } from "../../hooks/useMediaQuery";
import { scene } from "../../three/sceneState";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import "./sensing.css";

const SCENE = "layyah-s1-flood-detection";

/**
 * Observation becomes data. The satellite passes on the left while, on the
 * right, a real radar scene is acquired line by line: the scroll drives a
 * push-broom scan down the image, the way the sensor builds it.
 */
export function SensingSection() {
  const pin = useRef<HTMLDivElement>(null);
  const mobile = useMobile();
  const p = bySlug(SCENE);
  const sensors = sensorUse();

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (scene.reducedMotion) {
      gsap.set(q(".scan-img"), { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(q(".sensor-bar i"), { scaleX: 1 });
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: mobile
        ? { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.618 }
        : { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.618 },
    });
    tl.fromTo(q(".scan-img"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
      .fromTo(q(".scan-line"), { top: "0%" }, { top: "100%", duration: 1 }, 0)
      .fromTo(q(".scan-line"), { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.95)
      .fromTo(q(".sensor-bar i"), { scaleX: 0 }, { scaleX: 1, stagger: 0.0618, duration: 0.382, ease: "power2.out" }, 0.382)
      .fromTo(q(".scan-readout span"), { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.2 }, 0.2);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [mobile]);

  return (
    <SectionTransition id="sensing" sceneKey="sensing" className="sensing" labelledBy="sensing-title">
      <div ref={pin} className="sensing-pin">
        <div className="sensing-grid shell">
          <RevealText className="sensing-head">
            <p className="meta" data-reveal>
              03 · Data
            </p>
            <SplitText as="h2" id="sensing-title" className="display" text="Remote sensing" />
            <p className="body" data-reveal>
              {copy.sensingIntro}
            </p>
          </RevealText>

          {p && (
            <figure className="scan">
              <div className="scan-frame">
                <img className="scan-ghost" src={`/${p.image}`} alt="" aria-hidden="true" loading="lazy" />
                <img className="scan-img" src={`/${p.image}`} alt={`${p.title}: radar flood mapping over Layyah District`} loading="lazy" />
                <span className="scan-line" aria-hidden="true" />
                <span className="scan-corner tl" aria-hidden="true" />
                <span className="scan-corner br" aria-hidden="true" />
                <p className="scan-readout meta" aria-hidden="true">
                  <span>Sentinel-1 · C-band SAR</span>
                  <span>{p.place.lat.toFixed(2)}° N {p.place.lon.toFixed(2)}° E</span>
                  <span>Monsoon 2022</span>
                </p>
              </div>
              <figcaption className="scan-caption">
                <span className="meta">From the study</span>
                <span>
                  {p.metrics[0].value} {p.metrics[0].label}, {p.metrics[1].value} {p.metrics[1].label}
                </span>
              </figcaption>
            </figure>
          )}

          <ul className="sensors" aria-label="Instruments used across the studies">
            {sensors.map((s) => (
              <li key={s.name}>
                <span className="sensor-name">{s.name}</span>
                <span className="sensor-bar" aria-hidden="true">
                  <i style={{ width: `${(s.count / projects.length) * 100}%` }} />
                </span>
                <span className="sensor-n meta num">
                  {s.count} of {projects.length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionTransition>
  );
}
