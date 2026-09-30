import { scrollToTarget } from "../../lib/scroll";
import { profile, copy } from "../../data/profile";
import "./navigation.css";

interface Props {
  menuOpen: boolean;
  onMenu: () => void;
  stage: number;
}

/**
 * The fixed frame around the page: name on the left, menu on the right, and
 * along the bottom-left the story rail, EARTH → DECISION SUPPORT, with the
 * current stage lit. Drawn in difference blend so it reads over any section.
 */
export function Navigation({ menuOpen, onMenu, stage }: Props) {
  return (
    <>
      <header className="nav">
        <a
          className="nav-name"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          {profile.name}
        </a>
        <button
          type="button"
          className={`nav-menu ${menuOpen ? "is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={onMenu}
          data-cursor={menuOpen ? "CLOSE" : "MENU"}
        >
          <span className="nav-menu-text">{menuOpen ? "Close" : "Menu"}</span>
          <span className="nav-menu-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <nav className="rail" aria-label="Research story">
        <ol>
          {copy.story.map((s, i) => (
            <li key={s} className={i === stage ? "is-on" : i < stage ? "is-past" : ""} aria-current={i === stage ? "step" : undefined}>
              <span className="rail-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="rail-t">{s}</span>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
