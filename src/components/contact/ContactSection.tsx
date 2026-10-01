import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { copy, profile } from "../../data/profile";
import { SectionTransition } from "../transitions/SectionTransition";
import { MagneticButton } from "../ui/MagneticButton";
import { RevealText } from "../ui/RevealText";
import { SplitText } from "../ui/SplitText";
import "./contact.css";

const SUBJECT = encodeURIComponent("PhD position / research conversation");

/**
 * The end of the page, and the one thing it asks for. The globe returns as a
 * horizon behind the statement, one clear invitation sits under it, and the
 * email can be copied in a click for anyone who would rather not open a mail
 * client.
 */
export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2618);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    ["Email", `mailto:${profile.email}?subject=${SUBJECT}`],
    ["LinkedIn", profile.social.linkedin],
    ["GitHub", profile.social.github],
    ["ORCID", profile.social.orcid],
  ] as const;

  return (
    <SectionTransition id="contact" sceneKey="contact" className="contact" labelledBy="contact-title">
      <div className="shell contact-inner">
        <RevealText className="contact-head">
          <p className="meta contact-status" data-reveal>
            <span className="pulse-dot" aria-hidden="true" /> {profile.availability.status}
          </p>
          <SplitText as="h2" id="contact-title" className="display contact-title" text={"Let's explore\nEarth differently."} lines />
        </RevealText>

        <RevealText className="contact-body">
          <div className="contact-person" data-reveal>
            <img src={`/${profile.photo}`} alt="" loading="lazy" />
            <p className="lead">{copy.contactLead}</p>
          </div>
          <div className="contact-actions" data-reveal>
            <MagneticButton className="contact-cta" href={`mailto:${profile.email}?subject=${SUBJECT}`} cursor="WRITE" strength={15}>
              Start a conversation <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
            </MagneticButton>
            <button type="button" className="contact-copy meta" onClick={copyEmail} data-cursor="COPY">
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Copied" : profile.email}</span>
            </button>
          </div>
        </RevealText>

        <ul className="contact-links">
          {links.map(([label, href]) => (
            <li key={label}>
              <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})} data-cursor="OPEN">
                <span>{label}</span>
                <ArrowUpRight size={18} strokeWidth={1.25} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <footer className="contact-foot meta">
          <p className="contact-credits">{copy.dataCredits}</p>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Every study linked here is open source · Last updated {__BUILD_DATE__}</span>
          <a href="/classic/">Classic version of this site</a>
        </footer>
      </div>
    </SectionTransition>
  );
}
