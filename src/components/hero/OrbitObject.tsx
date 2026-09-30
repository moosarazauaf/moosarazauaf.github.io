import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshBasicMaterial } from "three";
import { GOLDEN_ANGLE } from "../../lib/golden";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";
import { ORBITS } from "./orbits";

/** Small bodies riding an orbit, spaced by the golden angle so they never
 *  bunch up. They stand for the research areas the orbit section opens. */
export function OrbitObject({ index, count }: { index: number; count: number }) {
  const group = useRef<Group>(null);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const o = ORBITS[index];
  const angle = useRef(index * 1.3);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    if (!scene.reducedMotion) angle.current += Math.min(delta, 0.05) * o.speed;
    g.children.forEach((child, i) => {
      const a = angle.current + i * GOLDEN_ANGLE * 1.6;
      child.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius, 0);
    });
    for (const m of mats.current) {
      if (!m) continue;
      m.color.copy(palette.fg);
      m.opacity = scene.current.rings * 0.9;
    }
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} renderOrder={3}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
