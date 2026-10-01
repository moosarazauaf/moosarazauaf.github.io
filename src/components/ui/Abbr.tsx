import type { ReactNode } from "react";
import { GLOSSARY } from "../../data/glossary";

const pattern = new RegExp(
  `(?<![\\w-])(${Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![\\w-])`,
  "g"
);

/**
 * Text with its abbreviations defined. The first time a term from the
 * glossary appears in a passage it is wrapped in <abbr>, so a reader from a
 * neighbouring field can hover, focus or have it read out, and nobody has to
 * know what OPTRAM stands for to follow the result.
 */
export function Abbr({ children }: { children: string }) {
  const seen = new Set<string>();
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of children.matchAll(pattern)) {
    const term = m[1];
    if (seen.has(term) || m.index === undefined) continue;
    seen.add(term);
    out.push(children.slice(last, m.index));
    out.push(
      <abbr key={m.index} title={GLOSSARY[term]} tabIndex={0}>
        {term}
      </abbr>
    );
    last = m.index + term.length;
  }
  out.push(children.slice(last));
  return <>{out}</>;
}
