import { site } from "../data/site";

interface GoatCounter {
  count?: (vars: { path: string; title?: string; event?: boolean }) => void;
}
declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

const local = () => /^(localhost|127\.|\[::1\])/.test(window.location.hostname);
/** A visitor who has asked not to be tracked is not counted at all. */
const optedOut = () => navigator.doNotTrack === "1" || (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

export const analyticsOn = () => site.goatcounter !== "" && !local() && !optedOut();

/** Loads the counter once. It records the page view itself. */
export function startAnalytics() {
  if (!analyticsOn() || document.querySelector("script[data-goatcounter]")) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${site.goatcounter}.goatcounter.com/count`;
  document.head.appendChild(s);
}

/** Counts something a visitor did, such as opening a study, so the numbers
 *  show which work people actually read and not only that they arrived. */
export function track(name: string, title?: string) {
  if (!analyticsOn()) return;
  window.goatcounter?.count?.({ path: name, title: title ?? name, event: true });
}
