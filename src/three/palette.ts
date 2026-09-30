import { Color } from "three";
import { scene } from "./sceneState";

const PAPER = new Color("#f4f3ef");
const INK = new Color("#0a0a0a");

/** Scene colours, recomputed once a frame from the page tone so the globe is
 *  always drawn in the page's own foreground on its own background. */
export const palette = {
  fg: new Color("#0a0a0a"),
  bg: new Color("#f4f3ef"),
  accent: new Color("#e0521f"),
  update() {
    const t = scene.current.tone;
    this.fg.copy(INK).lerp(PAPER, t);
    this.bg.copy(PAPER).lerp(INK, t);
  },
};
