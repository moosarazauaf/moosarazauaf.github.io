import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";

export interface LandMask {
  /** 0 ocean, 1 land, 2 Pakistan. */
  sample: (lat: number, lon: number) => number;
}

const W = 1024;
const H = 512;
const PAKISTAN_ID = "586";

/**
 * Rasterises Natural Earth country outlines (public domain, via world-atlas)
 * into an equirectangular mask: land in red, Pakistan in green. The globe's
 * dots then ask the mask whether they sit on land. The outlines load only
 * with the 3D chunk, so the first paint never waits for them.
 */
export async function buildLandMask(): Promise<LandMask> {
  const topo = (await import("world-atlas/countries-110m.json")).default as unknown as Topology;
  const countries = feature(topo, topo.objects.countries as GeometryCollection) as unknown as FeatureCollection;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { sample: () => 0 };

  const projection = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
  const path = geoPath(projection, ctx);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  for (const f of countries.features) {
    ctx.beginPath();
    path(f);
    ctx.fillStyle = String(f.id) === PAKISTAN_ID ? "#ff0" : "#f00";
    ctx.fill();
  }
  const px = ctx.getImageData(0, 0, W, H).data;

  return {
    sample(lat, lon) {
      const x = Math.min(W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * W)));
      const y = Math.min(H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * H)));
      const i = (y * W + x) * 4;
      if (px[i + 1] > 128) return 2;
      return px[i] > 128 ? 1 : 0;
    },
  };
}
