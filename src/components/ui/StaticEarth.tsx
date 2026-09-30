import { useEffect, useState } from "react";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, FeatureCollection } from "geojson";
import { PAKISTAN } from "../../lib/places";

/**
 * The globe without WebGL: the same Natural Earth outlines drawn as an
 * orthographic line engraving, turned to face Pakistan. Shown when WebGL is
 * unavailable, so the page still opens on the Earth rather than on an error.
 */
export function StaticEarth({ className = "" }: { className?: string }) {
  const [paths, setPaths] = useState<{ land: string[]; pak: string; grid: string; sphere: string } | null>(null);
  useEffect(() => {
    import("world-atlas/countries-110m.json").then((m) => {
      const topo = m.default as unknown as Topology;
      const fc = feature(topo, topo.objects.countries as GeometryCollection) as unknown as FeatureCollection;
      const proj = geoOrthographic().scale(240).translate([250, 250]).rotate([-PAKISTAN.lon + 25, -PAKISTAN.lat + 12]);
      const path = geoPath(proj);
      const pak = fc.features.find((f: Feature) => String(f.id) === "586");
      setPaths({
        land: fc.features.map((f) => path(f) ?? ""),
        pak: pak ? path(pak) ?? "" : "",
        grid: path(geoGraticule10()) ?? "",
        sphere: path({ type: "Sphere" }) ?? "",
      });
    });
  }, []);
  return (
    <svg className={`static-earth ${className}`} viewBox="0 0 500 500" role="img" aria-label="The Earth, turned to face Pakistan">
      {paths && (
        <>
          <path d={paths.sphere} fill="none" stroke="currentColor" strokeOpacity="0.5" />
          <path d={paths.grid} fill="none" stroke="currentColor" strokeOpacity="0.1" />
          {paths.land.map((d, i) => (
            <path key={i} d={d} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.5" />
          ))}
          <path d={paths.pak} fill="var(--radar)" />
        </>
      )}
    </svg>
  );
}
