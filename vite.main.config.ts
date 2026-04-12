import { defineConfig } from "vite";

// https://vitejs.dev/config

//better-sqlite3 - 
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["better-sqlite3"],
    },
  },
});
