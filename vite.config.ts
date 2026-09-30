import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served from the root of moosarazauaf.github.io. The previous
// static site lives on unchanged under public/classic and is copied as-is.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: { port: 5173, strictPort: true },
});
