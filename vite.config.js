

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.js",
        }
      : undefined,
  },
  
  plugins: [
    tailwindcss(), 
    reactRouter({
      future: {
        v3_singleFetch: false,
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app"),
    },
  },
  optimizeDeps: {
    // Prevent prebundling lucide-react icons files that can break on Windows path resolution
    exclude: ["lucide-react"],
  },
  ssr: {
    noExternal: ['react-i18next', 'i18next'],
  },
}));