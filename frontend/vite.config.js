// vite.config.js
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root:    ".",
  base:    "/dashboard/",

  build: {
    outDir:      "../dist/dashboard",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-query": ["@tanstack/react-query"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    chunkSizeWarningLimit: 500,
    minify:    "esbuild",
    target:    "es2020",
    sourcemap: false,
  },

  server: {
    port: 3000,
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
    },
  },

  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL ?? "/api"
    ),
  },
});
