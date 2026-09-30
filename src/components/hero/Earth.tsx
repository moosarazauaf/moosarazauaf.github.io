import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  type Group,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  ShaderMaterial,
  Vector3,
} from "three";
import { dotFragment, dotVertex } from "../../three/shaders/dots";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";
import { fibonacciSphere } from "../../three/utilities/fibonacci";
import { buildLandMask } from "../../three/utilities/landMask";
import { latLonToVec3 } from "../../three/utilities/geo";
import { projects } from "../../data/projects";

/** Unique study locations, from the project data. */
const SITES = [...new Map(projects.map((p) => [p.place.name, p.place])).values()];

export function Earth({ count }: { count: number }) {
  const [geo, setGeo] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    let alive = true;
    buildLandMask().then((mask) => {
      if (!alive) return;
      const pts = fibonacciSphere(count);
      const pos: number[] = [];
      const pak: number[] = [];
      const seed: number[] = [];
      const v = new Vector3();
      for (let i = 0; i < count; i++) {
        const lat = pts[i * 2];
        const lon = pts[i * 2 + 1];
        const m = mask.sample(lat, lon);
        if (!m) continue;
        latLonToVec3(lat, lon, 1, v);
        pos.push(v.x, v.y, v.z);
        pak.push(m === 2 ? 1 : 0);
        seed.push(((i * 0.618034) % 1 + 1) % 1);
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("aPak", new BufferAttribute(new Float32Array(pak), 1));
      g.setAttribute("aSeed", new BufferAttribute(new Float32Array(seed), 1));
      setGeo(g);
      scene.ready = true;
      window.dispatchEvent(new Event("earth:ready"));
    });
    return () => {
      alive = false;
    };
  }, [count]);

  useEffect(() => () => geo?.dispose(), [geo]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: dotVertex,
        fragmentShader: dotFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: 3 },
          uPixelRatio: { value: 1 },
          uTime: { value: 0 },
          uScan: { value: 0 },
          uInk: { value: palette.fg },
          uAccent: { value: palette.accent },
          uOpacity: { value: 1 },
        },
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const c = scene.current;
    // Dot size follows the globe's size on screen, capped so a close-up
    // becomes a halftone rather than a field of discs.
    const radiusPx = c.r * (state.size.height / 2);
    u.uSize.value = Math.min(7, Math.max(1.6, radiusPx * 0.0132));
    u.uPixelRatio.value = state.viewport.dpr;
    u.uOpacity.value = c.earth;
    if (!scene.reducedMotion) u.uScan.value = (u.uScan.value + Math.min(delta, 0.05) * 0.0618) % 1;
  });

  return (
    <group>
      <Occluder />
      {geo && <points geometry={geo} material={material} renderOrder={2} />}
      <Graticule />
      {SITES.map((s) => (
        <Site key={s.name} lat={s.lat} lon={s.lon} />
      ))}
    </group>
  );
}

/** A sphere in the page colour, hiding the far side of the globe. */
function Occluder() {
  const ref = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    if (!ref.current || !mat.current) return;
    mat.current.color.copy(palette.bg);
    mat.current.opacity = scene.current.earth;
    ref.current.visible = scene.current.earth > 0.002;
  });
  return (
    <mesh ref={ref} renderOrder={0}>
      <sphereGeometry args={[0.992, 64, 48]} />
      <meshBasicMaterial ref={mat} transparent depthWrite />
    </mesh>
  );
}

function Graticule() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const v = new Vector3();
    const w = new Vector3();
    const seg = 96;
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let i = 0; i < seg; i++) {
        latLonToVec3(lat, (i / seg) * 360 - 180, 1.001, v);
        latLonToVec3(lat, ((i + 1) / seg) * 360 - 180, 1.001, w);
        pts.push(v.x, v.y, v.z, w.x, w.y, w.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 15) {
      for (let i = 0; i < seg / 2; i++) {
        latLonToVec3((i / (seg / 2)) * 180 - 90, lon, 1.001, v);
        latLonToVec3(((i + 1) / (seg / 2)) * 180 - 90, lon, 1.001, w);
        pts.push(v.x, v.y, v.z, w.x, w.y, w.z);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  const mat = useRef<LineBasicMaterial>(null);
  useFrame(() => {
    if (!mat.current) return;
    mat.current.color.copy(palette.fg);
    mat.current.opacity = 0.09 * scene.current.earth;
  });
  return (
    <lineSegments geometry={geo} renderOrder={1}>
      <lineBasicMaterial ref={mat} transparent depthWrite={false} />
    </lineSegments>
  );
}

/** A study location: a dot and a ring that pulses outward. */
function Site({ lat, lon }: { lat: number; lon: number }) {
  const ring = useRef<Mesh>(null);
  const ringMat = useRef<MeshBasicMaterial>(null);
  const dotMat = useRef<MeshBasicMaterial>(null);
  const group = useRef<Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const pos = useMemo(() => latLonToVec3(lat, lon, 1.004), [lat, lon]);
  useEffect(() => {
    group.current?.lookAt(pos.clone().multiplyScalar(2));
  }, [pos]);
  useFrame((state) => {
    const r = ring.current;
    if (!r || !ringMat.current || !dotMat.current) return;
    const t = scene.reducedMotion ? 0.4 : (state.clock.elapsedTime * 0.618 + phase) % 1;
    r.scale.setScalar(0.4 + t * 1.6);
    ringMat.current.opacity = (1 - t) * scene.current.earth;
    dotMat.current.opacity = scene.current.earth;
  });
  return (
    <group ref={group} position={pos}>
      <mesh renderOrder={3}>
        <circleGeometry args={[0.009, 16]} />
        <meshBasicMaterial ref={dotMat} color="#e0521f" transparent depthWrite={false} />
      </mesh>
      <mesh ref={ring} renderOrder={3}>
        <ringGeometry args={[0.022, 0.026, 32]} />
        <meshBasicMaterial ref={ringMat} color="#e0521f" transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
