import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "../../data/profile";
import { research } from "../../data/research";
import { useMobile } from "../../hooks/useMediaQuery";
import { scene } from "../../three/sceneState";
import { DragSurface } from "../hero/DragSurface";
import { SectionTransition } from "../transitions/SectionTransition";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import { ResearchDetail } from "./ResearchDetail";
import { ResearchObject } from "./ResearchObject";
import { ResearchOrbit } from "./ResearchOrbit";
import "./research.css";

interface Props {
  webgl: boolean;
  onOpenStudy: (slug: string) => void;
}

/**
 * The orbital research system. On a wide screen the section pins for one
 * extra viewport of scroll, and that scroll turns the system a little, so
 * scrolling feels like moving around it rather than past it. On a phone the
 * areas are laid out as a simple list around a small globe.
 */
export function ResearchSection({ webgl, onOpenStudy }: Props) {
  const pin = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [focus, setFocus] = useState<string | null>(null);
  const mobile = useMobile();

  useEffect(() => {
    scene.focus = focus;
  }, [focus]);

  useEffect(() => {
    if (!pin.current || mobile) return;
    const st = ScrollTrigger.create({
      trigger: pin.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      onUpdate: (s) => {
        progress.current = s.progress;
      },
    });
    return () => st.kill();
  }, [mobile]);

  // Leaving the section closes an open area, so the globe is never left
  // parked to one side for the next section.
  useEffect(() => {
    if (!pin.current) return;
    const st = ScrollTrigger.create({
      trigger: pin.current.parentElement,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => setFocus(null),
      onLeaveBack: () => setFocus(null),
    });
    return () => st.kill();
  }, []);

  const select = useCallback((id: string) => {
    setFocus(id);
  }, []);
  const close = useCallback(() => {
    const id = focus;
    setFocus(null);
    if (id) window.setTimeout(() => document.querySelector<HTMLElement>(`.robj[data-id="${id}"]`)?.focus(), 50);
  }, [focus]);

  const area = research.find((a) => a.id === focus) ?? null;

  return (
    <SectionTransition id="research" sceneKey="research" className="research" labelledBy="research-title">
      <div ref={pin} className={`research-pin ${focus ? "has-focus" : ""}`}>
        <RevealText className="research-head shell">
          <p className="meta" data-reveal>
            02 · Observation
          </p>
          <SplitText as="h2" id="research-title" className="display" text="Research" />
          <p className="body research-intro" data-reveal>
            {copy.researchIntro}
          </p>
        </RevealText>

        {mobile ? (
          <div className="research-list shell">
            {research.map((a, i) => (
              <ResearchObject key={a.id} area={a} index={i} active={false} onHover={() => {}} onSelect={select} />
            ))}
          </div>
        ) : (
          <>
            <ResearchOrbit focus={focus} onSelect={select} progress={progress} />
            {webgl && !focus && <DragSurface className="research-drag" />}
          </>
        )}

        <ResearchDetail area={area} onClose={close} onOpenStudy={onOpenStudy} />

        <ul className="research-legend meta" aria-hidden="true">
          <li>
            <i className="lg-core" /> Backed by studies
          </li>
          <li>
            <i className="lg-dir" /> Direction
          </li>
        </ul>
      </div>
    </SectionTransition>
  );
}
