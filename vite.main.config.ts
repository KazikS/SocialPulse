import { defineConfig } from "vite";
import path from "path";
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
