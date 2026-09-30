import { INV2, PHI } from "../../lib/golden";

/** Three orbits at φ-spaced radii (1.382, 1.618, 2.618 globe radii), with
 *  angular speeds in φ ratio so they never fall into step with each other.
 *  The satellite rides the first; small research nodes ride the other two. */
export const ORBITS = [
  { radius: 1 + INV2, tilt: 1.18, turn: -0.42, speed: 0.382 },
  { radius: PHI, tilt: 1.32, turn: 0.36, speed: 0.382 / PHI },
  { radius: PHI * PHI, tilt: 1.42, turn: -0.12, speed: 0.382 / (PHI * PHI) },
] as const;
