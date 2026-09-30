import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INV, INV2, PHI, damp, lerp, smoothstep } from "../lib/golden";
import { keyframes } from "../three/keyframes";
import { FRAME_KEYS, scene, type Frame, type SceneKey } from "../three/sceneState";

gsap.registerPlugin(ScrollTrigger);

interface Span {
  key: SceneKey;
  top: number;
  bottom: number;
}

const STAGE: Record<SceneKey, number> = {
  hero: 0,
  research: 1,
  sensing: 2,
  projects: 3,
  data: 4,
  publications: 5,
  about: 6,
  contact: 6,
};

const PAPER = [0xf4, 0xf3, 0xef];
const INK = [0x0a, 0x0a, 0x0a];

const blend = (a: Frame, b: Frame, t: number): Frame => {
  const out = { ...a };
  for (const k of FRAME_KEYS) out[k] = lerp(a[k], b[k], t);
  // Colour flips late and fast, so text is never grey on grey for long.
  out.tone = lerp(a.tone, b.tone, smoothstep(INV2, INV, t));
  return out;
};

/**
 * Turns scroll position into a camera target. Each section holds its own
 * keyframe while it fills the screen; the one viewport of scroll between two
 * sections blends from one to the next. The current frame then eases toward
 * the target every tick, which is what makes a scroll feel like a camera move
 * rather than a jump.
 */
export function startSceneTracker(onStage: (stage: number, key: SceneKey) => void) {
  let spans: Span[] = [];
  let lastTone = -1;
  let lastStage = -1;
  const root = document.documentElement;

  const measure = () => {
    spans = [...document.querySelectorAll<HTMLElement>("[data-scene]")].map((el) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return { key: el.dataset.scene as SceneKey, top, bottom: top + r.height };
    });
  };

  const targetAt = (y: number): Frame => {
    const vh = window.innerHeight;
    const m = scene.mobile;
    const p = y + vh / 2;
    if (!spans.length) return keyframes.hero(0, m);
    const hold = spans.map((s) => {
      const a = s.top + vh / 2;
      return [a, Math.max(a, s.bottom - vh / 2)] as const;
    });
    for (let i = 0; i < spans.length; i++) {
      const [a, b] = hold[i];
      const kf = keyframes[spans[i].key];
      if (p < a && i === 0) return kf(0, m);
      if (p >= a && p <= b) return kf(b > a ? (p - a) / (b - a) : 0, m);
      const next = hold[i + 1];
      if (next && p > b && p < next[0]) {
        const t = (p - b) / (next[0] - b);
        return blend(kf(1, m), keyframes[spans[i + 1].key](0, m), t);
      }
    }
    return keyframes[spans[spans.length - 1].key](1, m);
  };

  const activeAt = (y: number): SceneKey => {
    const p = y + window.innerHeight / 2;
    const s = spans.find((x) => p >= x.top && p < x.bottom);
    return s ? s.key : p < (spans[0]?.top ?? 0) ? "hero" : "contact";
  };

  const tick = (_t: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, 0.1);
    const y = window.scrollY;
    const target = targetAt(y);

    // An open research area pulls the globe aside to make room for its detail.
    if (scene.focus && scene.active === "research") {
      target.x = scene.mobile ? 0 : -INV;
      target.y = scene.mobile ? 0.62 : 0;
      target.r = scene.mobile ? 0.24 : INV2 * INV + 0.2;
    }
    target.earth *= scene.intro.earth;
    target.rings *= scene.intro.earth;
    target.stars *= scene.intro.earth;
    target.sat *= scene.intro.sat;
    scene.target = target;

    const rate = PHI * PHI * PHI; // 4.24 per second
    for (const k of FRAME_KEYS) {
      scene.current[k] = scene.reducedMotion ? target[k] : damp(scene.current[k], target[k], rate, dt);
    }

    const tone = scene.current.tone;
    if (Math.abs(tone - lastTone) > 0.002) {
      lastTone = tone;
      const mix = (i: number) => Math.round(lerp(PAPER[i], INK[i], tone));
      const bg = `rgb(${mix(0)} ${mix(1)} ${mix(2)})`;
      const inv = (i: number) => Math.round(lerp(INK[i], PAPER[i], tone));
      root.style.setProperty("--bg", bg);
      root.style.setProperty("--fg", `rgb(${inv(0)} ${inv(1)} ${inv(2)})`);
      root.style.setProperty("--tone", tone.toFixed(3));
      root.dataset.tone = tone > 0.5 ? "dark" : "light";
    }

    const key = activeAt(y);
    scene.active = key;
    const stage = STAGE[key];
    if (stage !== lastStage) {
      lastStage = stage;
      scene.stage = stage;
      onStage(stage, key);
    }
  };

  measure();
  ScrollTrigger.addEventListener("refresh", measure);
  window.addEventListener("resize", measure);
  gsap.ticker.add(tick);
  // Fonts and images change heights after first paint.
  const late = window.setTimeout(() => ScrollTrigger.refresh(), 1200);

  return () => {
    ScrollTrigger.removeEventListener("refresh", measure);
    window.removeEventListener("resize", measure);
    gsap.ticker.remove(tick);
    window.clearTimeout(late);
  };
}
