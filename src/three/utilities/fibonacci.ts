import { GOLDEN_ANGLE } from "../../lib/golden";

/** n points spread evenly over a unit sphere along a golden-angle spiral.
 *  Returns [lat, lon] in degrees for each. */
export function fibonacciSphere(n: number): Float32Array {
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const theta = GOLDEN_ANGLE * i;
    out[i * 2] = (Math.asin(y) * 180) / Math.PI;
    out[i * 2 + 1] = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  }
  return out;
}
