import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["better-sqlite3"],
    },
  },
  resolve: {
    alias: {
      "@main": path.resolve(__dirname, "src/main"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
