import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, type Points, type PointsMaterial } from "three";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";

/** Faint background stars, only really visible once the page turns dark. */
export function StarField({ count }: { count: number }) {
  const geo = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 40;
      const s = Math.sqrt(1 - u * u);
      p[i * 3] = s * Math.cos(t) * r;
      p[i * 3 + 1] = u * r;
      p[i * 3 + 2] = -Math.abs(s * Math.sin(t) * r);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(p, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);
  const ref = useRef<Points>(null);
  const mat = useRef<PointsMaterial>(null);
  useFrame((_, delta) => {
    if (!ref.current || !mat.current) return;
    const s = scene.current.stars * scene.current.tone;
    ref.current.visible = s > 0.002;
    mat.current.opacity = s * 0.8;
    mat.current.color.copy(palette.fg);
    if (!scene.reducedMotion) ref.current.rotation.y += Math.min(delta, 0.05) * 0.004;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial ref={mat} size={1.4} sizeAttenuation={false} transparent depthWrite={false} />
    </points>
  );
}
