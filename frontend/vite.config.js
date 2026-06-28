// vite.config.js
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import fs               from "fs";
import path             from "path";

// ── Плагін: копіює .htaccess в outDir після білду
function copyHtaccess() {
  return {
    name: "copy-htaccess",
    closeBundle() {
      const src  = path.resolve(__dirname, ".htaccess");
      const dest = path.resolve(__dirname, "../public_html/app/.htaccess");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log("✓ .htaccess скопійовано в public_html/app/");
      } else {
        console.warn("⚠ .htaccess не знайдено в папці frontend/");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyHtaccess()],
  root:    ".",
  base:    "/app/",

  build: {
    outDir:      "../public_html/app",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    chunkSizeWarningLimit: 500,
    minify:    "esbuild",
    esbuild:   { drop: ["console", "debugger"] },
    target:    "es2020",
    sourcemap: false,
  },

  server: {
    port: 3000,
    proxy: {
      // Змін target на адресу свого локального бекенду:
      // OpenServer: "http://indexfast.local"
      // або WAMP/XAMPP: "http://localhost"
      // або з портом: "http://localhost:80"
      "/api": { target: "http://indexfast.local", changeOrigin: true },
    },
  },

  // VITE_API_URL береться автоматично з frontend/.env.local або frontend/.env
  // Приклад: VITE_API_URL=https://api.indexfast.pp.ua/api
  // Vite підставляє всі import.meta.env.VITE_* змінні при білді
});
