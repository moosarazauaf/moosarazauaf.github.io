import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, type Group, Line, LineDashedMaterial } from "three";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";
import { ORBITS } from "./orbits";
import { OrbitObject } from "./OrbitObject";

function useRing(radius: number) {
  const line = useMemo(() => {
    const pts: number[] = [];
    const seg = 256;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    const m = new LineDashedMaterial({ transparent: true, depthWrite: false, dashSize: 0.018, gapSize: 0.03 });
    const l = new Line(g, m);
    l.computeLineDistances();
    l.renderOrder = 1;
    return l;
  }, [radius]);
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineDashedMaterial).dispose();
    },
    [line]
  );
  return line;
}

function Ring({ index }: { index: number }) {
  const o = ORBITS[index];
  const line = useRing(o.radius);
  const group = useRef<Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const c = scene.current;
    const m = line.material as LineDashedMaterial;
    m.color.copy(palette.fg);
    m.opacity = 0.32 * c.rings;
    group.current.visible = c.rings > 0.002;
    group.current.scale.setScalar(c.spread);
  });
  return (
    <group ref={group} rotation={[o.tilt, o.turn, 0]}>
      <primitive object={line} />
      {index > 0 && <OrbitObject index={index} count={index === 1 ? 3 : 2} />}
    </group>
  );
}

export function OrbitSystem() {
  return (
    <group>
      {ORBITS.map((_, i) => (
        <Ring key={i} index={i} />
      ))}
    </group>
  );
}
