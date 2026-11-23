"""Dissolve the site's district outlines into the seven units of the study atlas.

Run: uv run --no-project --with shapely python scripts/build_pakistan_provinces.py
"""
import json
from shapely.geometry import MultiPolygon, mapping, shape
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

UNIT = {
    "Federally Administered Tribal Areas": "Khyber Pakhtunkhwa",  # merged into the province in 2018
    "Azad Kashmir": "Azad Jammu and Kashmir",
    None: "Gilgit-Baltistan",  # the source leaves these ten districts without a province
}
src = json.load(open("public/geo/pakistan-districts.geojson", encoding="utf8"))
parts = {}
for f in src["features"]:
    p = f["properties"].get("province")
    parts.setdefault(UNIT.get(p, p), []).append(shape(f["geometry"]).buffer(0))


def rounded(o):
    return [rounded(x) for x in o] if isinstance(o, (list, tuple)) and not isinstance(o[0], float) else [round(o[0], 3), round(o[1], 3)]


features = []
for name, geoms in sorted(parts.items()):
    # The small buffer closes slivers between neighbouring districts.
    u = unary_union(geoms).buffer(0.01).buffer(-0.01).simplify(0.008)
    polys = [orient(g, -1) for g in (u.geoms if isinstance(u, MultiPolygon) else [u]) if g.area > 0.002]  # d3 expects clockwise rings
    g = mapping(MultiPolygon(polys))
    features.append({"type": "Feature", "properties": {"name": name}, "geometry": {"type": "MultiPolygon", "coordinates": rounded(g["coordinates"])}})
assert len(features) == 7, [f["properties"]["name"] for f in features]
json.dump({"type": "FeatureCollection", "features": features}, open("public/geo/pakistan-provinces.geojson", "w", encoding="utf8"), separators=(",", ":"))
print([f["properties"]["name"] for f in features])
