import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial } from "three";
import { rimFragment, rimVertex } from "../../three/shaders/dots";
import { palette } from "../../three/palette";
import { scene } from "../../three/sceneState";

/** No glow: on a paper page a glow disappears. The atmosphere is a rim that
 *  darkens toward the limb, like the edge of an engraved plate. */
export function Atmosphere() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: rimVertex,
        fragmentShader: rimFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uInk: { value: palette.fg }, uOpacity: { value: 1 } },
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    material.uniforms.uOpacity.value = scene.current.earth;
  });
  return (
    <mesh material={material} renderOrder={4}>
      <sphereGeometry args={[1.003, 96, 64]} />
    </mesh>
  );
}
