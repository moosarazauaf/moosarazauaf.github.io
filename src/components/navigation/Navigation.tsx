import { scrollToTarget } from "../../lib/scroll";
import { profile } from "../../data/profile";
import type { SceneKey } from "../../three/sceneState";
import "./navigation.css";

interface Props {
  menuOpen: boolean;
  onMenu: () => void;
  active: SceneKey;
}

/** The sections a reader is most likely to want, always one click away. */
const LINKS: { href: string; label: string; on: SceneKey[] }[] = [
  { href: "#research", label: "Research", on: ["research", "sensing"] },
  { href: "#evidence", label: "Evidence", on: ["projects"] },
  { href: "#earthpulse", label: "Software", on: ["software"] },
  { href: "#data", label: "Data", on: ["data"] },
  { href: "#publications", label: "Publications", on: ["publications"] },
  { href: "#about", label: "About", on: ["about"] },
  { href: "#contact", label: "Contact", on: ["contact"] },
];

/**
 * The fixed frame around the page: name on the left and, on a wide screen,
 * the sections as plain links with the current one marked, so nobody has to
 * scroll the whole page or open a menu to find the publications. Narrow
 * screens get the menu button instead. Drawn in difference blend so it reads
 * over any section.
 */
export function Navigation({ menuOpen, onMenu, active }: Props) {
  return (
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

      <nav className="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={l.on.includes(active) ? "is-on" : ""}
            aria-current={l.on.includes(active) ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(l.href);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>

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
  );
}
