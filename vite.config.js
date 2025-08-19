

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./app/entry.server.jsx",
          external: [/^node:/, /^@react-router/],
        }
      : undefined,
  },
  
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app"),
    },
  },
  
  // Exclude server files from Vite processing using a different approach
  optimizeDeps: {
    exclude: ['express', 'prisma', 'i18next', 'i18next-fs-backend', 'i18next-http-middleware'],
  },
  
  // Ensure server files are not processed
  ssr: {
    noExternal: ['@react-router/*'],
  },
}));


// import { reactRouter } from "@react-router/dev/vite";
// import tailwindcss from "@tailwindcss/vite";
// import { defineConfig } from "vite";

// export default defineConfig({
  
//   plugins: [reactRouter(), tailwindcss()],
// });
