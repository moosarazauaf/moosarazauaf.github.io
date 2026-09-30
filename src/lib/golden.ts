/** The golden ratio and its powers. Sizes, radii, orbital periods and timings
 *  across the site are drawn from this one number, so the proportions agree
 *  with each other instead of being tuned one by one. */
export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618…
export const INV = 1 / PHI; // 0.618…
export const INV2 = INV * INV; // 0.382…

/** Golden angle in radians, the spacing sunflower seeds use. Points placed at
 *  this step never line up, which is why the globe's dots look even. */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Durations in seconds, a φ series. */
export const T = {
  xs: INV2 * INV, // 0.236
  s: INV2, // 0.382
  m: INV, // 0.618
  l: 1,
  xl: PHI, // 1.618
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Frame-rate independent approach toward a target. `rate` is per second. */
export const damp = (a: number, b: number, rate: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-rate * dt));
