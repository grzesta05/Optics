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
    include: ["**/__tests__/**/*.test.?(c|m)[jt]s?(x)"],
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@": "/src",
      "@routes": "/src/routes",
      "@components": "/src/components",
      "@styles": "/src/styles",
    },
  },
});
