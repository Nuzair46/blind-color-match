import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages project site is served from /blind-color-match/
  base: "/blind-color-match/",
  plugins: [react()],
});
