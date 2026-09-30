import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { gsap } from "gsap";
import type { Group, PerspectiveCamera } from "three";
import { INV, INV2, damp, lerp } from "../../lib/golden";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";
import { PAKISTAN, toRad } from "../../three/utilities/geo";
import { Atmosphere } from "./Atmosphere";
import { Earth } from "./Earth";
import { OrbitSystem } from "./OrbitSystem";
import { Satellite } from "./Satellite";
import { StarField } from "./StarField";

const FOV = 38;
const CAM_Z = 6;
const AXIAL = toRad(23.4) * INV; // a lean, not the full axial tilt

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * Renders on demand: the GSAP ticker asks for a frame only while something is
 * on screen and the tab is visible, so the GPU idles through the text-heavy
 * sections instead of drawing an invisible globe sixty times a second.
 */
function Driver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let drewEmpty = false;
    const tick = () => {
      if (document.hidden) return;
      const c = scene.current;
      const alive = c.earth > 0.002 || c.sat > 0.002 || c.rings > 0.002 || c.stars * c.tone > 0.002;
      if (alive) {
        drewEmpty = false;
        invalidate();
      } else if (!drewEmpty) {
        drewEmpty = true;
        invalidate();
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [invalidate]);
  return null;
}

/** Places the globe by the current frame and turns it: slow auto-rotation,
 *  a lean toward the pointer, drag with inertia, and in the data section a
 *  turn to face Pakistan. */
function World({ count }: { count: number }) {
  const outer = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);
  // Starts turned so Pakistan, where every study sits, faces the viewer.
  const free = useRef({ y: -toRad(58), x: 0, leanX: 0, leanY: 0 });
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    palette.update();
    const c = scene.current;
    const halfH = Math.tan(toRad(FOV / 2)) * CAM_Z;
    const halfW = halfH * (state.size.width / state.size.height);
    if (!outer.current || !tilt.current || !spin.current) return;
    outer.current.position.set(c.x * halfW, c.y * halfH, 0);
    outer.current.scale.setScalar(Math.max(0.0001, c.r * halfH));

    const f = free.current;
    const d = scene.drag;
    if (!scene.reducedMotion && !d.active) f.y += dt * 0.0618; // one turn every ~100 s
    f.y += d.rotY;
    f.x = Math.max(-0.6, Math.min(0.6, f.x + d.rotX));
    d.rotY = 0;
    d.rotX = 0;
    if (!d.active) {
      // After release it coasts, then settles back to its resting lean.
      f.y += d.vx * dt;
      f.x = Math.max(-0.6, Math.min(0.6, f.x + d.vy * dt));
      d.vx = damp(d.vx, 0, 2.618, dt);
      d.vy = damp(d.vy, 0, 2.618, dt);
      f.x = damp(f.x, 0, INV, dt);
    }
    const lean = scene.reducedMotion ? 0 : 1;
    f.leanX = damp(f.leanX, -scene.pointer.y * 0.08 * lean, 3, dt);
    f.leanY = damp(f.leanY, scene.pointer.x * 0.12 * lean, 3, dt);

    const faceY = -toRad(PAKISTAN.lon);
    const y = f.y + f.leanY;
    spin.current.rotation.y = y + wrap(faceY - y) * c.pak;
    tilt.current.rotation.x = lerp(AXIAL + f.x + f.leanX, toRad(PAKISTAN.lat), c.pak);
    tilt.current.rotation.z = lerp(-INV2 * 0.2, 0, c.pak);

    camera.position.z = CAM_Z;
  });

  return (
    <group ref={outer}>
      <group ref={tilt}>
        <group ref={spin}>
          <Earth count={count} />
        </group>
        <Atmosphere />
      </group>
      <OrbitSystem />
      <Satellite />
    </group>
  );
}

export default function EarthScene({ mobile }: { mobile: boolean }) {
  const [dprMax, setDprMax] = useState(mobile ? 1.5 : 2);
  return (
    <div className="stage-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, dprMax]}
        camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* On a struggling GPU, drop resolution before anything else. */}
        <PerformanceMonitor onDecline={() => setDprMax(1)}>
          <Driver />
          <StarField count={mobile ? 500 : 1300} />
          <World count={mobile ? 12000 : 24000} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
