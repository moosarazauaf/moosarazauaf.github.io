import { createElement, type ElementType, type ReactNode } from "react";

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  /** Render each line on its own, e.g. a stacked name. */
  lines?: boolean;
  id?: string;
  children?: ReactNode;
}

/**
 * Splits text into masked words for a line reveal. Screen readers get the
 * whole text once, from aria-label; the split pieces are hidden from them so
 * a name is not read out word by word as separate fragments.
 */
export function SplitText({ text, as = "span", className, lines = false, id }: Props) {
  const rows = lines ? text.split("\n") : [text];
  return createElement(
    as,
    { className, "aria-label": text.replace(/\n/g, " "), id },
    rows.map((row, r) => (
      <span key={r} aria-hidden="true" className={lines ? "split-line" : undefined} style={lines ? { display: "block" } : undefined}>
        {row.split(" ").map((word, i, arr) => (
          <span key={i}>
            <span className="w">
              <span className="wi">{word}</span>
            </span>
            {i < arr.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    ))
  );
}
