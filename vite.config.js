

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig( ( { isSsrBuild } ) => ( {
  build: {
    rollupOptions: isSsrBuild
      ? {
        input: "./server/app.js",
      }
      : undefined,
  },
  
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app"),
    },
  },
} ) );


// import { reactRouter } from "@react-router/dev/vite";
// import tailwindcss from "@tailwindcss/vite";
// import { defineConfig } from "vite";

// export default defineConfig({
  
//   plugins: [reactRouter(), tailwindcss()],
// });
