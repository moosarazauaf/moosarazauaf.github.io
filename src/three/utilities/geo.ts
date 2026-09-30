import { Vector3 } from "three";

const D2R = Math.PI / 180;

/** Latitude/longitude on a unit sphere. Longitude 0 faces +z (the camera),
 *  so turning the globe by -lon brings that meridian to the front. */
export function latLonToVec3(lat: number, lon: number, r = 1, out = new Vector3()) {
  const la = lat * D2R;
  const lo = lon * D2R;
  return out.set(Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r);
}

export { PAKISTAN } from "../../lib/places";
export const toRad = (deg: number) => deg * D2R;
