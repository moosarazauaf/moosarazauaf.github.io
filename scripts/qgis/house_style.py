"""House style for the portfolio's maps, matching the Lahore publication
figures: A4 landscape, neatline with interior ticks, coordinates on the top
and right, titled legend top-left, north arrow top-right, scale bar
bottom-right. Run inside QGIS with exec(open(...).read())."""
from qgis.core import *
from qgis.PyQt.QtGui import QColor, QFont
import os

OUT = r"C:/Users/Moosa/AppData/Local/Temp/claude/C--Users-Moosa-OneDrive-Desktop-Flood-map/788a59a9-70bb-4205-9133-387b313d1a1b/scratchpad/qgis/"
P = QgsProject.instance()
FONT = "MS Shell Dlg 2"


def tf(size):
    f = QgsTextFormat(); f.setFont(QFont(FONT)); f.setSize(size)
    f.setSizeUnit(QgsUnitTypes.RenderPoints); f.setColor(QColor("#111111")); return f


def add_raster(path, name):
    for l in list(P.mapLayers().values()):
        if l.name() == name: P.removeMapLayer(l.id())
    r = QgsRasterLayer(path, name); assert r.isValid(), path
    P.addMapLayer(r, False); return r


def add_vector(path, name):
    for l in list(P.mapLayers().values()):
        if l.name() == name: P.removeMapLayer(l.id())
    v = QgsVectorLayer(path, name, "ogr"); assert v.isValid(), path
    P.addMapLayer(v, False); return v


def paletted(layer, classes):
    cl = [QgsPalettedRasterRenderer.Class(v, QColor(c), lab) for v, c, lab in classes]
    layer.setRenderer(QgsPalettedRasterRenderer(layer.dataProvider(), 1, cl))


def binned(layer, items):
    sh = QgsColorRampShader(); sh.setColorRampType(QgsColorRampShader.Discrete)
    sh.setColorRampItemList([QgsColorRampShader.ColorRampItem(v, QColor(c), lab) for v, c, lab in items])
    rs = QgsRasterShader(); rs.setRasterShaderFunction(sh)
    layer.setRenderer(QgsSingleBandPseudoColorRenderer(layer.dataProvider(), 1, rs))


def outline(layer, color="#232323", width=0.26):
    layer.setRenderer(QgsSingleSymbolRenderer(QgsFillSymbol.createSimple(
        {"color": "0,0,0,0", "outline_color": color, "outline_width": str(width)})))


def make_map(name, layers, legend, title, extent, png, interval=0.2, seg_km=5, prec=1,
             legend_xy=(20, 22), credit=None):
    """legend: list of (layer, label or None, is_raster)."""
    lm = P.layoutManager()
    old = lm.layoutByName(name)
    if old: lm.removeLayout(old)
    lay = QgsPrintLayout(P); lay.initializeDefaults(); lay.setName(name); lm.addLayout(lay)
    m = QgsLayoutItemMap(lay)
    m.attemptMove(QgsLayoutPoint(10, 10, QgsUnitTypes.LayoutMillimeters))
    m.attemptResize(QgsLayoutSize(270, 185, QgsUnitTypes.LayoutMillimeters))
    m.setLayers(layers); m.setKeepLayerSet(True); m.setCrs(QgsCoordinateReferenceSystem("EPSG:4326"))
    m.setFrameEnabled(True); m.setFrameStrokeWidth(QgsLayoutMeasurement(0.3)); m.setBackgroundColor(QColor("#ffffff"))
    m.zoomToExtent(extent); lay.addLayoutItem(m)
    g = QgsLayoutItemMapGrid("grid", m); m.grids().addGrid(g)
    g.setIntervalX(interval); g.setIntervalY(interval); g.setStyle(QgsLayoutItemMapGrid.FrameAnnotationsOnly)
    g.setFrameStyle(QgsLayoutItemMapGrid.InteriorTicks); g.setFrameWidth(2.0); g.setFramePenSize(0.3)
    g.setAnnotationEnabled(True); g.setAnnotationFormat(QgsLayoutItemMapGrid.DecimalWithSuffix)
    g.setAnnotationPrecision(prec); g.setAnnotationFont(QFont(FONT, 10))
    for side, show in ((QgsLayoutItemMapGrid.Left, False), (QgsLayoutItemMapGrid.Bottom, False),
                       (QgsLayoutItemMapGrid.Top, True), (QgsLayoutItemMapGrid.Right, True)):
        g.setAnnotationDisplay(QgsLayoutItemMapGrid.ShowAll if show else QgsLayoutItemMapGrid.HideAll, side)
        g.setAnnotationPosition(QgsLayoutItemMapGrid.OutsideMapFrame, side)
    g.setAnnotationDirection(QgsLayoutItemMapGrid.Horizontal, QgsLayoutItemMapGrid.Top)
    g.setAnnotationDirection(QgsLayoutItemMapGrid.VerticalDescending, QgsLayoutItemMapGrid.Right)

    lg = QgsLayoutItemLegend(lay); lg.setLinkedMap(m); lg.setAutoUpdateModel(False)
    root = lg.model().rootGroup(); root.clear()
    for layer, label, is_raster in legend:
        node = root.addLayer(layer)
        if label is None:
            QgsLegendRenderer.setNodeLegendStyle(node, QgsLegendStyle.Hidden)
        else:
            node.setCustomProperty("legend/title-label", label)
        if is_raster:  # drop the "Band 1 (Gray)" line a raster adds
            n = len(lg.model().layerOriginalLegendNodes(node))
            QgsMapLayerLegendUtils.setLegendNodeOrder(node, list(range(1, n)))
        lg.model().refreshLayerLegend(node)
    lg.setTitle(title); lg.setWrapString("|")
    lg.rstyle(QgsLegendStyle.Title).setTextFormat(tf(12))
    lg.rstyle(QgsLegendStyle.SymbolLabel).setTextFormat(tf(12))
    lg.rstyle(QgsLegendStyle.Subgroup).setTextFormat(tf(12))
    lg.setSymbolWidth(7); lg.setSymbolHeight(4); lg.setFrameEnabled(False); lg.setBackgroundEnabled(False)
    lay.addLayoutItem(lg)
    lg.attemptMove(QgsLayoutPoint(legend_xy[0], legend_xy[1], QgsUnitTypes.LayoutMillimeters)); lg.adjustBoxSize()

    na = QgsLayoutItemPicture(lay); na.setPicturePath(":/images/north_arrows/layout_default_north_arrow.svg")
    lay.addLayoutItem(na)
    na.attemptResize(QgsLayoutSize(12, 17, QgsUnitTypes.LayoutMillimeters))
    na.attemptMove(QgsLayoutPoint(255, 16, QgsUnitTypes.LayoutMillimeters))

    sb = QgsLayoutItemScaleBar(lay); sb.setStyle("Line Ticks Up"); sb.setLinkedMap(m)
    sb.setUnits(QgsUnitTypes.DistanceKilometers); sb.setUnitLabel("km")
    sb.setNumberOfSegments(2); sb.setNumberOfSegmentsLeft(0); sb.setUnitsPerSegment(seg_km)
    sb.setHeight(3); sb.setTextFormat(tf(12)); sb.setBackgroundEnabled(False)
    lay.addLayoutItem(sb); sb.update()
    sb.attemptMove(QgsLayoutPoint(270 - sb.rect().width(), 172, QgsUnitTypes.LayoutMillimeters))

    if credit:
        lb = QgsLayoutItemLabel(lay); lb.setText(credit); lb.setTextFormat(tf(8)); lay.addLayoutItem(lb)
        lb.adjustSizeToText(); lb.attemptMove(QgsLayoutPoint(10, 197, QgsUnitTypes.LayoutMillimeters))

    s = QgsLayoutExporter.ImageExportSettings(); s.dpi = 300
    r = QgsLayoutExporter(lay).exportToImage(png, s)
    print(name, "export", r, os.path.getsize(png) // 1024, "KB")
    return lay
