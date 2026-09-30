import { INV, INV2, PHI, lerp, smoothstep } from "../lib/golden";
import { blankFrame, type Frame, type SceneKey } from "./sceneState";

/**
 * Where the camera system sits in each section, as a function of progress
 * through that section (0 at its start, 1 at its end). Between sections the
 * scroll tracker blends one section's last frame into the next one's first.
 *
 * The globe's radius steps through the φ series (0.382, 0.618, 1, 1.618) so
 * each change of scale is the same proportion as the last.
 */
type KF = (p: number, mobile: boolean) => Frame;

const f = (o: Partial<Frame>): Frame => ({ ...blankFrame(), ...o });

export const keyframes: Record<SceneKey, KF> = {
  hero: (_p, m) =>
    f({ x: m ? 0 : INV2, y: m ? -0.46 : 0.1, r: m ? 0.5 : INV * 0.94, earth: 1, rings: 1, sat: 1, stars: 0.2 }),

  // On a phone the list scrolls over the globe, so the globe steps back.
  research: (p, m) =>
    f({ x: m ? 0 : INV2 * INV, y: m ? 0.1 : -0.1, r: m ? 0.28 : INV2, earth: m ? 1 - smoothstep(0.05, 0.3, p) : 1, rings: 0.3, sat: 0.7, stars: 1, tone: 1, spread: PHI }),

  sensing: (p, m) =>
    f({
      x: m ? 0 : -0.92,
      y: m ? -1.28 : lerp(-0.2, 0.1, p),
      r: m ? 0.8 : 0.95,
      earth: 1,
      rings: 0.6,
      sat: 1,
      stars: 0.1,
    }),

  projects: () => f({ x: 0, y: -1.8, r: 1, earth: 0, rings: 0, sat: 0 }),

  // Fly in to Pakistan over the first 38% of the pinned section, then hand
  // over to the district map drawn in HTML on top.
  data: (p) => {
    const dive = smoothstep(0, INV2, p);
    const fade = 1 - smoothstep(INV2 * INV, INV2, p);
    return f({ x: 0, y: 0, r: lerp(INV, PHI * PHI, dive), earth: fade, rings: 0, sat: 0, stars: fade, tone: 1, pak: 1 });
  },

  publications: () => f({ x: 0, y: 1.8, r: INV, earth: 0, tone: 0 }),
  about: () => f({ earth: 0, tone: 0 }),

  // The peak-end: the page closes on the horizon, with the satellite passing.
  contact: (_p, m) =>
    f({ x: 0, y: m ? -1.62 : -1 - PHI * 0.72, r: PHI, earth: 1, rings: 0.4, sat: 1, stars: 1, tone: 1 }),
};
