import { Color } from "three";
import { scene } from "./sceneState";

const PAPER = new Color("#f4f1ea");
const INK = new Color("#0f1d16");

/** Scene colours, recomputed once a frame from the page tone so the globe is
 *  always drawn in the page's own foreground on its own background. */
export const palette = {
  fg: new Color("#0f1d16"),
  bg: new Color("#f4f1ea"),
  accent: new Color("#d0703c"),
  update() {
    const t = scene.current.tone;
    this.fg.copy(INK).lerp(PAPER, t);
    this.bg.copy(PAPER).lerp(INK, t);
  },
};
