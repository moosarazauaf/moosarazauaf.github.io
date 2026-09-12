"""Build data/pakistan-districts.geojson, the district map on the portfolio.

Two inputs, joined by district name:

  1. Per-district land-cover and carbon numbers, computed by the live app's own
     analysis module (../pakistan-lulc-carbon/src/analysis.py) from its cached
     GLC-FCS30D tables. Running the app's code rather than re-deriving the
     numbers here keeps the map and the app from drifting apart.
  2. District outlines from geoBoundaries gbOpen PAK ADM2 (public domain).

The two sources do not use the same district vocabulary, so ALIASES below maps
geoBoundaries names onto the app's. Anything still unmatched is written with
value = null and drawn as "no data" rather than guessed at. The Gilgit-Baltistan
districts are the honest example: the app carries GB as one whole territory
because its boundary source gives it no district children, so its ten outlines
here have no district-level number to show.

Geometry is rounded to three decimal places, roughly 110 m, which is far finer
than a district outline needs at web-map zoom and cuts the file by about 60%.

Usage:  python scripts/build_pakistan_districts.py
"""

import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
APP_SRC = os.path.join(os.path.dirname(REPO), "pakistan-lulc-carbon", "src")
OUT = os.path.join(REPO, "data", "pakistan-districts.geojson")

GEOJSON_URL = (
    "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/"
    "gbOpen/PAK/ADM2/geoBoundaries-PAK-ADM2_simplified.geojson"
)
CACHE = os.path.join(HERE, ".cache-pak-adm2.geojson")

YEAR_FROM, YEAR_TO = 2000, 2022
PRECISION = 3

# geoBoundaries name -> app name. Mostly spelling; the "Agency" entries are the
# former FATA agencies, which the two sources name from different years.
ALIASES = {
    "Bajaur": "Bajaur Agency",
    "Battagram": "Batagram",
    "Islamabad Capital Territory": "Islamabad",
    "Jafarabad": "Jaffarabad",
    "Karachi": "Karachi City",
    "Khyber": "Khyber Agency",
    "Kurram": "Kurram Agency",
    "Malakand": "Malakand PA",
    "Mohmand": "Mohmand Agency",
    "Naushehro Feroze": "Naushahro Feroze",
    "Nawabshah": "Shaheed Benazirabad",
    "North Waziristan": "North Waziristan Agency",
    "Orakzai": "Orakzai Agency",
    "Qilla Abdullah": "Killa Abdullah",
    "Qilla Saifullah": "Killa Saifullah",
    "Sheikhpura": "Sheikhupura",
    "South Waziristan": "South Waziristan Agency",
    "Vihari": "Vehari",
}


def norm(s):
    return re.sub(r"[^a-z]", "", s.lower())


def round_coords(x):
    if isinstance(x, (int, float)):
        return round(x, PRECISION)
    return [round_coords(v) for v in x]


def fetch_geometry():
    if not os.path.exists(CACHE):
        print("downloading district outlines ...")
        urllib.request.urlretrieve(GEOJSON_URL, CACHE)
    with open(CACHE, encoding="utf-8") as fh:
        return json.load(fh)


def main():
    sys.path.insert(0, APP_SRC)
    import analysis  # noqa: E402  (path has to be set first)

    rows = {r["district"]: r for r in analysis.district_table(YEAR_FROM, YEAR_TO)}
    lookup = {norm(k): v for k, v in rows.items()}
    for geo_name, app_name in ALIASES.items():
        if app_name in rows:
            lookup[norm(geo_name)] = rows[app_name]

    geo = fetch_geometry()
    matched, unmatched = 0, []
    features = []

    for f in geo["features"]:
        name = f["properties"]["shapeName"]
        row = lookup.get(norm(name))
        props = {"name": name}
        if row:
            matched += 1
            props.update({
                "province": row["province"],
                "areaHa": round(row["area_ha"], 1),
                "builtupPct": round(row["builtup_pct_to"], 2),
                "builtupGainHa": round(row["builtup_gain_ha"], 1),
                "vegChangeHa": round(row["veg_change_ha"], 1),
                "netMgC": round(row["net_Mg_C"], 1),
                "netMgCPerHa": round(row["net_Mg_C_per_ha"], 4),
            })
        else:
            unmatched.append(name)
        features.append({
            "type": "Feature",
            "properties": props,
            "geometry": {
                "type": f["geometry"]["type"],
                "coordinates": round_coords(f["geometry"]["coordinates"]),
            },
        })

    covered = sum(f["properties"].get("areaHa", 0) for f in features)
    total = sum(r["area_ha"] for r in rows.values())

    out = {
        "type": "FeatureCollection",
        "meta": {
            "yearFrom": YEAR_FROM,
            "yearTo": YEAR_TO,
            "source": "GLC-FCS30D at 30 m, district tables from pakistan-lulc-carbon",
            "boundaries": "geoBoundaries gbOpen PAK ADM2 (public domain)",
            "districtsWithData": matched,
            "districtsTotal": len(features),
            "areaCoveredPct": round(100 * covered / total, 1),
            "noDataNote": (
                "Gilgit-Baltistan is carried as one territory in the source "
                "tables, so its districts are drawn without a value."
            ),
        },
        "features": features,
    }

    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))

    print(f"matched {matched} of {len(features)} outlines")
    print(f"covers {out['meta']['areaCoveredPct']}% of the accounted national area")
    print(f"no value: {', '.join(sorted(unmatched))}")
    print(f"wrote {OUT} ({os.path.getsize(OUT) / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
