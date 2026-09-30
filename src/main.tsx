import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/opsz.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "./styles/globals.css";
import "./styles/typography.css";
import "./styles/animations.css";
import { App } from "./app/App";

// Development only: lets the scene be inspected and settled from the console.
if (import.meta.env.DEV) {
  Promise.all([import("./three/sceneState"), import("gsap")]).then(([s, g]) => {
    Object.assign(window, { __scene: s.scene, __gsap: g.gsap });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
