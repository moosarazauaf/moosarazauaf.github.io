import { useEffect, useRef } from "react";
import { menuTimeline } from "../../animations/menuAnimations";
import { lockScroll, scrollToTarget } from "../../lib/scroll";
import { profile } from "../../data/profile";
import { scene } from "../../three/sceneState";
import { SplitText } from "../ui/SplitText";
import { SECTIONS } from "./sections";
import "./menu.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen menu. Opening locks the page scroll and moves focus to the
 * first item; Escape or a choice closes it, gives the scroll back and returns
 * focus to the menu button. Hovering one item leans it right and quiets the
 * rest.
 */
export function MenuOverlay({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<ReturnType<typeof menuTimeline> | null>(null);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (!root.current) return;
    tl.current = menuTimeline(root.current, scene.reducedMotion);
    tl.current.eventCallback("onReverseComplete", () => {
      if (root.current) root.current.style.visibility = "hidden";
      const id = pending.current;
      pending.current = null;
      if (id) scrollToTarget(`#${id}`);
    });
    return () => {
      tl.current?.kill();
    };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      lockScroll(true);
      t.timeScale(1).play();
      window.setTimeout(() => root.current?.querySelector<HTMLElement>(".menu-item")?.focus(), 80);
    } else if (t.progress() > 0) {
      lockScroll(false);
      t.timeScale(1.618).reverse();
      document.querySelector<HTMLElement>(".nav-menu")?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && root.current) {
        const f = [...root.current.querySelectorAll<HTMLElement>("a, button")];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  const go = (id: string) => {
    pending.current = id;
    onClose();
  };

  return (
    <div ref={root} id="menu" className="menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden={false} style={{ visibility: "hidden" }}>
      <div className="menu-panel">
        <ol className="menu-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a
                className="menu-item"
                href={`#${s.id}`}
                data-cursor="GO"
                onClick={(e) => {
                  e.preventDefault();
                  go(s.id);
                }}
              >
                <span className="menu-n meta" data-menu-meta>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <SplitText text={s.label} className="menu-label" />
                <span className="menu-note meta" data-menu-meta>
                  {s.note}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="menu-foot" data-menu-meta>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span className="menu-links">
            <a href={profile.social.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={profile.social.github} target="_blank" rel="noopener">GitHub</a>
            <a href={profile.social.orcid} target="_blank" rel="noopener">ORCID</a>
          </span>
        </div>
      </div>
    </div>
  );
}
