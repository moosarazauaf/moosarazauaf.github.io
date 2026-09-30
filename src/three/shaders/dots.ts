/** The globe's land dots. Each dot fades toward the limb so the sphere reads
 *  as round without any lighting, and a slow scan band brightens the dots it
 *  passes, the way a push-broom sensor sweeps the ground. */
export const dotVertex = /* glsl */ `
  attribute float aPak;
  attribute float aSeed;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uScan;
  varying float vPak;
  varying float vFacing;
  varying float vScan;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * world;
    vec3 n = normalize(mat3(modelMatrix) * position);
    vec3 toCam = normalize(cameraPosition - world.xyz);
    vFacing = dot(n, toCam);
    vPak = aPak;
    float band = abs(fract(position.y * 0.5 + 0.5 - uScan) - 0.5);
    vScan = smoothstep(0.06, 0.0, band);
    float s = uSize * (1.0 + aPak * 0.618 + vScan * 0.382) * (0.85 + 0.3 * aSeed);
    gl_PointSize = s * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;

export const dotFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vPak;
  varying float vFacing;
  varying float vScan;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.36, d);
    float limb = smoothstep(-0.02, 0.382, vFacing);
    vec3 col = mix(uInk, uAccent, vPak);
    float a = edge * limb * uOpacity * (0.72 + 0.28 * vScan + 0.3 * vPak);
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }
`;

/** A thin rim, darker at the edge, standing in for the atmosphere. */
export const rimVertex = /* glsl */ `
  varying float vRim;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * normal);
    vec3 toCam = normalize(cameraPosition - world.xyz);
    vRim = 1.0 - max(dot(n, toCam), 0.0);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const rimFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform float uOpacity;
  varying float vRim;
  void main() {
    float a = pow(vRim, 3.0) * 0.55 * uOpacity;
    gl_FragColor = vec4(uInk, a);
  }
`;
