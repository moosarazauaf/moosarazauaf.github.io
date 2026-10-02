import { useCallback, useEffect, useState } from "react";
import { bySlug } from "../data/projects";
import { track } from "../lib/analytics";

const read = () => {
  const m = window.location.hash.match(/^#project\/([\w-]+)/);
  return m && bySlug(m[1]) ? m[1] : null;
};

/**
 * Which study is open, kept in the URL as #project/<slug> so a study can be
 * linked to directly and the back button closes it. The same links the old
 * site used keep working.
 */
export function useProjectRoute() {
  const [open, setOpen] = useState<string | null>(read);

  useEffect(() => {
    const on = () => setOpen(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const openProject = useCallback((slug: string) => {
    const p = bySlug(slug);
    if (!p) return;
    track(`study/${slug}`, p.short);
    if (read() !== slug) window.history.pushState(null, "", `#project/${slug}`);
    setOpen(slug);
  }, []);

  const closeProject = useCallback(() => {
    if (read()) window.history.pushState(null, "", window.location.pathname + window.location.search);
    setOpen(null);
  }, []);

  useEffect(() => {
    const on = () => setOpen(read());
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);

  return { open, openProject, closeProject };
}
