import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, type Group, Line, LineBasicMaterial, type MeshBasicMaterial, Vector3 } from "three";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";
import { ORBITS } from "./orbits";

const TRAIL = 72;
const TRAIL_ARC = 1.1; // radians of orbit the trail covers

/**
 * A simplified Earth-observation satellite: a bus, two solar wings and a
 * radar antenna, always pointing at the ground the way a real one does. Its
 * trail is the arc of orbit just flown, fading out behind it.
 */
export function Satellite() {
  const o = ORBITS[0];
  const orbit = useRef<Group>(null);
  const body = useRef<Group>(null);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const angle = useRef(2.2);
  const centre = useMemo(() => new Vector3(), []);

  const trail = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(new Float32Array(TRAIL * 3), 3));
    g.setAttribute("color", new Float32BufferAttribute(new Float32Array(TRAIL * 4), 4));
    const l = new Line(g, new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }));
    l.renderOrder = 5;
    l.frustumCulled = false;
    return l;
  }, []);
  useEffect(
    () => () => {
      trail.geometry.dispose();
      (trail.material as LineBasicMaterial).dispose();
    },
    [trail]
  );

  useFrame((_, delta) => {
    const c = scene.current;
    if (!orbit.current || !body.current) return;
    orbit.current.visible = c.sat > 0.002;
    if (!orbit.current.visible) return;
    const dt = Math.min(delta, 0.05);
    if (!scene.reducedMotion) {
      // Scrolling hurries it along a little, then it settles back.
      const push = Math.min(Math.abs(scene.scrollVelocity) * 0.012, 1.2);
      angle.current += dt * (o.speed * 0.618 + push);
    }
    const a = angle.current;
    body.current.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius, 0);
    orbit.current.parent?.getWorldPosition(centre);
    body.current.lookAt(centre);

    const g = trail.geometry;
    const pos = g.getAttribute("position") as Float32BufferAttribute;
    const col = g.getAttribute("color") as Float32BufferAttribute;
    const fg = palette.fg;
    for (let i = 0; i < TRAIL; i++) {
      const t = i / (TRAIL - 1);
      const b = a - t * TRAIL_ARC;
      pos.setXYZ(i, Math.cos(b) * o.radius, Math.sin(b) * o.radius, 0);
      col.setXYZW(i, fg.r, fg.g, fg.b, (1 - t) * (1 - t) * 0.7 * c.sat);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.color.copy(i === 3 ? palette.accent : palette.fg);
      m.opacity = c.sat;
    });
  });

  const mat = (i: number) => (
    <meshBasicMaterial
      ref={(m) => {
        mats.current[i] = m;
      }}
      transparent
      depthWrite={false}
    />
  );

  return (
    <group ref={orbit} rotation={[o.tilt, o.turn, 0]}>
      <primitive object={trail} />
      <group ref={body} scale={0.9}>
        <mesh renderOrder={6}>
          <boxGeometry args={[0.045, 0.045, 0.07]} />
          {mat(0)}
        </mesh>
        <mesh position={[0.1, 0, 0]} renderOrder={6}>
          <boxGeometry args={[0.13, 0.003, 0.05]} />
          {mat(1)}
        </mesh>
        <mesh position={[-0.1, 0, 0]} renderOrder={6}>
          <boxGeometry args={[0.13, 0.003, 0.05]} />
          {mat(2)}
        </mesh>
        <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} renderOrder={6}>
          <cylinderGeometry args={[0.012, 0.004, 0.02, 12]} />
          {mat(3)}
        </mesh>
      </group>
    </group>
  );
}
