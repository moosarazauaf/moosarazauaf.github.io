/**
 * One mutable object shared by the WebGL scene, the scroll tracker and the
 * HTML overlays. Nothing here goes through React state: it changes every
 * frame, and a re-render per frame is exactly what the page must not do.
 */

export type SceneKey =
  | "hero"
  | "research"
  | "sensing"
  | "projects"
  | "data"
  | "publications"
  | "about"
  | "contact";

/** Everything the camera system can move. Positions are in viewport units:
 *  x in half-widths from centre, y and radius in half-heights, so a keyframe
 *  means the same thing on every screen. */
export interface Frame {
  x: number;
  y: number;
  r: number;
  earth: number; // globe opacity
  rings: number; // orbital rings opacity
  sat: number; // satellite opacity
  stars: number;
  tone: number; // 0 paper, 1 ink
  pak: number; // 0 free rotation, 1 turned to face Pakistan
  spread: number; // ring radius multiplier, >1 flies through them
}

export const blankFrame = (): Frame => ({
  x: 0,
  y: 0,
  r: 0.618,
  earth: 0,
  rings: 0,
  sat: 0,
  stars: 0,
  tone: 0,
  pak: 0,
  spread: 1,
});

export const scene = {
  target: blankFrame(),
  current: blankFrame(),
  /** Pointer in -1..1, used for the globe's small lean toward the cursor. */
  pointer: { x: 0, y: 0 },
  /** Drag-to-rotate. rotX/rotY collect movement since the last frame; vx/vy
   *  are the release velocity in radians per second, decaying to rest. */
  drag: { active: false, vx: 0, vy: 0, rotX: 0, rotY: 0 },
  /** The opening sequence releases the globe and the satellite on its beat. */
  intro: { earth: 0, sat: 0 },
  /** Lenis scroll velocity, used to hurry the satellite along. */
  scrollVelocity: 0,
  /** Which research area is open, if any. Moves the globe aside. */
  focus: null as string | null,
  /** Stage in the Earth → decision-support story, 0..5, or 6 when complete. */
  stage: 0,
  active: "hero" as SceneKey,
  reducedMotion: false,
  mobile: false,
  ready: false,
};

export const FRAME_KEYS = Object.keys(blankFrame()) as (keyof Frame)[];
