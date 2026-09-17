import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const buildMode = process.env.VITE_BUILD_MODE || "demo";
if (!new Set(["demo", "private"]).has(buildMode)) {
  throw new Error("VITE_BUILD_MODE 只能是 demo 或 private");
}
const healthDataFile = buildMode === "private"
  ? "./src/lib/health-data.private.ts"
  : "./src/lib/health-data.ts";

export default defineConfig({
  root: projectRoot,
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@health-data": fileURLToPath(new URL(healthDataFile, import.meta.url)),
    },
  },
  build: {
    outDir: buildMode === "private" ? "dist-private" : "dist-demo",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8022",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [fileURLToPath(new URL("./src/test/setup.ts", import.meta.url))],
  },
});
