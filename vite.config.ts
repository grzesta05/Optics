/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@": "/src",
      "@routes": "/src/routes",
      "@components": "/src/Components",
      "@styles": "/src/styles",
    },
  },
});
