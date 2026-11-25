"""Publication maps for the studies: A4 landscape, one to three panels side by
side, neatlines with interior ticks and coordinates, a shared legend, scale
bar, north arrow and a Pakistan locator. Run inside QGIS with
exec(open(...).read()), then call study_map(...).
"""
import json
import os
from qgis.core import *
from qgis.PyQt.QtCore import Qt
from qgis.PyQt.QtGui import QColor, QFont

P = QgsProject.instance()
FONT = "Segoe UI"
PROVINCES = r"C:/Users/Moosa/OneDrive/Desktop/moosarazauaf.github.io/public/geo/pakistan-provinces.geojson"


def tf(size, color="#111111", bold=False):
    f = QgsTextFormat()
    q = QFont(FONT)
    q.setBold(bold)
    f.setFont(q)
    f.setSize(size)
    f.setSizeUnit(QgsUnitTypes.RenderPoints)
    f.setColor(QColor(color))
    return f


def _add(layer):
    for l in list(P.mapLayers().values()):
        if l.name() == layer.name():
            P.removeMapLayer(l.id())
    assert layer.isValid(), layer.source()
    P.addMapLayer(layer, False)
    return layer


def raster(path, name, vis=None, classes=None, ramp_labels=None, opacity=1.0):
    """vis: Earth Engine style dict (min, max, palette). classes: [(value, colour, label)].
    A one-colour palette draws every valid pixel in that colour."""
    r = _add(QgsRasterLayer(path, name))
    if classes:
        r.setRenderer(QgsPalettedRasterRenderer(r.dataProvider(), 1, [QgsPalettedRasterRenderer.Class(v, QColor(c), lab) for v, c, lab in classes]))
    elif vis and len(vis.get("palette", [])) > 1:
        lo, hi, pal = float(vis["min"]), float(vis["max"]), vis["palette"]
        items = [QgsColorRampShader.ColorRampItem(lo + (hi - lo) * i / (len(pal) - 1), QColor("#" + c.lstrip("#"))) for i, c in enumerate(pal)]
        sh = QgsColorRampShader(lo, hi)
        sh.setColorRampType(QgsColorRampShader.Interpolated)
        sh.setColorRampItemList(items)
        sh.setClip(False)
        ls = QgsColorRampLegendNodeSettings()
        if ramp_labels:
            ls.setMinimumLabel(ramp_labels[0])
            ls.setMaximumLabel(ramp_labels[1])
        sh.setLegendSettings(QgsColorRampLegendNodeSettings(ls))
        rs = QgsRasterShader()
        rs.setRasterShaderFunction(sh)
        ren = QgsSingleBandPseudoColorRenderer(r.dataProvider(), 1, rs)
        ren.setClassificationMin(lo)
        ren.setClassificationMax(hi)
        r.setRenderer(ren)
    elif vis:
        c = "#" + vis["palette"][0].lstrip("#")
        sh = QgsColorRampShader()
        sh.setColorRampType(QgsColorRampShader.Discrete)
        sh.setColorRampItemList([QgsColorRampShader.ColorRampItem(float("inf"), QColor(c), name)])
        rs = QgsRasterShader()
        rs.setRasterShaderFunction(sh)
        r.setRenderer(QgsSingleBandPseudoColorRenderer(r.dataProvider(), 1, rs))
    r.renderer().setOpacity(opacity)
    return r


def vector(path, name, stroke="#222222", width=0.35, fill="0,0,0,0", dash=False):
    v = _add(QgsVectorLayer(path, name, "ogr"))
    props = {"color": fill, "outline_color": stroke, "outline_width": str(width)}
    if dash:
        props["outline_style"] = "dash"
    v.setRenderer(QgsSingleSymbolRenderer(QgsFillSymbol.createSimple(props)))
    return v


def _grid(m, interval, left, right, prec):
    g = QgsLayoutItemMapGrid("grid", m)
    m.grids().addGrid(g)
    g.setCrs(QgsCoordinateReferenceSystem("EPSG:4326"))
    g.setIntervalX(interval)
    g.setIntervalY(interval)
    g.setStyle(QgsLayoutItemMapGrid.FrameAnnotationsOnly)
    g.setFrameStyle(QgsLayoutItemMapGrid.InteriorTicks)
    g.setFrameWidth(1.8)
    g.setFramePenSize(0.3)
    g.setAnnotationEnabled(True)
    g.setAnnotationFormat(QgsLayoutItemMapGrid.DecimalWithSuffix)
    g.setAnnotationPrecision(prec)
    g.setAnnotationTextFormat(tf(7.5))
    for side, show in ((QgsLayoutItemMapGrid.Left, left), (QgsLayoutItemMapGrid.Right, right),
                       (QgsLayoutItemMapGrid.Top, True), (QgsLayoutItemMapGrid.Bottom, False)):
        only = QgsLayoutItemMapGrid.LongitudeOnly if side in (QgsLayoutItemMapGrid.Top, QgsLayoutItemMapGrid.Bottom) else QgsLayoutItemMapGrid.LatitudeOnly
        g.setAnnotationDisplay(only if show else QgsLayoutItemMapGrid.HideAll, side)
        g.setFrameDivisions(only, side)
        g.setAnnotationPosition(QgsLayoutItemMapGrid.OutsideMapFrame, side)
    g.setAnnotationDirection(QgsLayoutItemMapGrid.Horizontal, QgsLayoutItemMapGrid.Top)
    g.setAnnotationDirection(QgsLayoutItemMapGrid.VerticalDescending, QgsLayoutItemMapGrid.Right)
    g.setAnnotationDirection(QgsLayoutItemMapGrid.Vertical, QgsLayoutItemMapGrid.Left)


def _label(lay, text, x, y, size=9.5, color="#111111", w=None, bold=False):
    lb = QgsLayoutItemLabel(lay)
    lb.setText(text)
    lb.setTextFormat(tf(size, color, bold))
    lay.addLayoutItem(lb)
    if w:
        lb.attemptResize(QgsLayoutSize(w, 6, QgsUnitTypes.LayoutMillimeters))
    else:
        lb.adjustSizeToText()
    lb.attemptMove(QgsLayoutPoint(x, y, QgsUnitTypes.LayoutMillimeters))
    return lb


def study_map(name, panels, legend, extent, png, outline=None, credit="", grid=0.25, prec=2,
              seg_km=10, legend_cols=3, locator=True, credit_gap=38, background="#ffffff"):
    """panels: [{"layers": [...], "label": "(a) ..."}]. legend: [(layer, title or None)].
    extent: QgsRectangle in EPSG:4326. outline: vector drawn on every panel."""
    lm = P.layoutManager()
    old = lm.layoutByName(name)
    if old:
        lm.removeLayout(old)
    lay = QgsPrintLayout(P)
    lay.initializeDefaults()
    lay.setName(name)
    lm.addLayout(lay)

    n = len(panels)
    left, right, top, gap = 14, 283, 16, 16 if n > 1 else 0
    w = (right - left - gap * (n - 1)) / n
    # Draw in the local UTM zone so shapes and the scale bar are true; ticks stay in degrees.
    wgs = QgsCoordinateReferenceSystem("EPSG:4326")
    utm = QgsCoordinateReferenceSystem(f"EPSG:326{int((extent.center().x() + 180) / 6) + 1:02d}")
    pext = QgsCoordinateTransform(wgs, utm, P).transformBoundingBox(extent)
    ratio = pext.height() / pext.width()
    h = min(138, w * ratio)
    if n == 1:  # one panel: size the frame to the area instead of stretching it
        w = min(w, h / ratio)
    maps = []
    for i, p in enumerate(panels):
        x = left + i * (w + gap)
        m = QgsLayoutItemMap(lay)
        lay.addLayoutItem(m)
        m.attemptMove(QgsLayoutPoint(x, top, QgsUnitTypes.LayoutMillimeters))
        m.attemptResize(QgsLayoutSize(w, h, QgsUnitTypes.LayoutMillimeters))
        m.setCrs(utm)
        m.setLayers(([outline] if outline else []) + p["layers"])
        m.setKeepLayerSet(True)
        m.setFrameEnabled(True)
        m.setFrameStrokeWidth(QgsLayoutMeasurement(0.3))
        m.setBackgroundColor(QColor(background))
        m.zoomToExtent(pext)
        _grid(m, grid, i == 0, i == n - 1, prec)
        _label(lay, p["label"], x, top - 9.5, 9.5, w=w)
        maps.append(m)

    side = n == 1 and right - left - w > 90  # a single panel leaves room for a side column
    xs = left + w + 16
    y0 = top if side else top + h + 9
    lg = QgsLayoutItemLegend(lay)
    lg.setLinkedMap(maps[-1])
    lg.setAutoUpdateModel(False)
    root = lg.model().rootGroup()
    root.clear()
    for layer, title in legend:
        node = root.addLayer(layer)
        node.setCustomProperty("legend/title-label", title or "")
        if title is None:
            QgsLegendRenderer.setNodeLegendStyle(node, QgsLegendStyle.Hidden)
        lg.model().refreshLayerLegend(node)
        if isinstance(layer, QgsRasterLayer):  # drop the "Band 1 (Gray)" line a raster adds
            k = len(lg.model().layerOriginalLegendNodes(node))
            if k > 1:
                QgsMapLayerLegendUtils.setLegendNodeOrder(node, list(range(1, k)))
                lg.model().refreshLayerLegend(node)
    lg.setTitle("")
    lg.setColumnCount(1 if side else legend_cols)
    lg.setSplitLayer(True)
    lg.setWrapString("|")
    for st in (QgsLegendStyle.Title, QgsLegendStyle.Subgroup, QgsLegendStyle.SymbolLabel):
        lg.rstyle(st).setTextFormat(tf(8.5, bold=(st == QgsLegendStyle.Subgroup)))
    lg.setSymbolWidth(6)
    lg.setSymbolHeight(3.6)
    lg.setFrameEnabled(False)
    lg.setBackgroundEnabled(False)
    lay.addLayoutItem(lg)
    lg.attemptMove(QgsLayoutPoint(xs if side else left, y0, QgsUnitTypes.LayoutMillimeters))
    lg.adjustBoxSize()

    xr = right
    if locator:
        prov = vector(PROVINCES, "Pakistan provinces", stroke="#8f928c", width=0.12, fill="236,233,224,255")
        loc = QgsLayoutItemMap(lay)
        lay.addLayoutItem(loc)
        lw, lh = 30, 30
        loc.attemptMove(QgsLayoutPoint(right - lw, top + h - lh if side else y0, QgsUnitTypes.LayoutMillimeters))
        loc.attemptResize(QgsLayoutSize(lw, lh, QgsUnitTypes.LayoutMillimeters))
        loc.setCrs(QgsCoordinateReferenceSystem("EPSG:4326"))
        box = QgsVectorLayer("Polygon?crs=EPSG:4326", f"{name} locator box", "memory")
        f = QgsFeature()
        f.setGeometry(QgsGeometry.fromRect(extent.buffered(max(extent.width(), extent.height()) * 0.35)))
        box.dataProvider().addFeatures([f])
        box.setRenderer(QgsSingleSymbolRenderer(QgsFillSymbol.createSimple({"color": "214,74,34,90", "outline_color": "#c2410c", "outline_width": "0.35"})))
        _add(box)
        loc.setLayers([box, prov])
        loc.setKeepLayerSet(True)
        loc.zoomToExtent(QgsRectangle(60.5, 23.4, 77.9, 37.2))
        loc.setFrameEnabled(True)
        loc.setFrameStrokeWidth(QgsLayoutMeasurement(0.25))
        loc.setBackgroundColor(QColor("#f7f9fa"))
        xr = right - lw - 8

    na = QgsLayoutItemPicture(lay)
    na.setPicturePath(":/images/north_arrows/layout_default_north_arrow.svg")
    lay.addLayoutItem(na)
    na.attemptResize(QgsLayoutSize(8, 12, QgsUnitTypes.LayoutMillimeters))
    na.attemptMove(QgsLayoutPoint(xr - 8, top + h - 12 if side else y0, QgsUnitTypes.LayoutMillimeters))

    sb = QgsLayoutItemScaleBar(lay)
    sb.setStyle("Line Ticks Up")
    sb.setLinkedMap(maps[0])
    sb.setUnits(QgsUnitTypes.DistanceKilometers)
    sb.setUnitLabel("km")
    sb.setNumberOfSegments(2)
    sb.setNumberOfSegmentsLeft(0)
    sb.setUnitsPerSegment(seg_km)
    sb.setHeight(2.5)
    sb.setTextFormat(tf(8))
    sb.setBackgroundEnabled(False)
    lay.addLayoutItem(sb)
    sb.update()
    sb.attemptMove(QgsLayoutPoint(xs if side else xr - 14 - sb.rect().width(), top + h - 9 if side else y0 + 3, QgsUnitTypes.LayoutMillimeters))

    if credit:
        _label(lay, credit, left, top + h + 8 if side else y0 + credit_gap, 6.5, "#555555", w=right - left)

    s = QgsLayoutExporter.ImageExportSettings()
    s.dpi = 300
    s.cropToContents = True
    s.cropMargins = QgsMargins(24, 24, 24, 24)
    r = QgsLayoutExporter(lay).exportToImage(png, s)
    print(name, "export", r, os.path.getsize(png) // 1024, "KB")
    return lay
