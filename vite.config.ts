import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const healthDataFile = process.env.VITE_PRIVATE_DATA === "true"
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
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8022",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("./src/test/setup.ts", import.meta.url))],
  },
});
