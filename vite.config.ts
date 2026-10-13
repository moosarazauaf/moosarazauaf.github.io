import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

/** Adds a preload for the Latin text face, the only font the first view
 *  needs, so the name is set in it from the first paint. */
function preloadFont(): Plugin {
  return {
    name: "preload-font",
    transformIndexHtml(_html, ctx) {
      const font = Object.keys(ctx.bundle ?? {}).find((f) => /inter-latin-opsz-normal.*\.woff2$/.test(f));
      if (!font) return [];
      return [{ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: "/" + font, crossorigin: "" }, injectTo: "head" }];
    },
  };
}

// The site is served from the root of moosarazauaf.github.io. The previous
// static site lives on unchanged under public/classic and is copied as-is.
export default defineConfig({
  plugins: [react(), preloadFont()],
  base: "/",
  // Stamped into the footer, so a reader can tell how current the page is.
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })),
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: { port: 5173, strictPort: true },
});
