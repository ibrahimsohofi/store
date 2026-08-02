import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@shared": path.resolve(process.cwd(), "./shared"),
    },
  },
  appType: "custom",
  ssr: {
    // Packages that ship CJS-only "main" entries need to be inlined so Vite
    // can pick their ESM build and give us proper named exports during SSR.
    noExternal: ["react-helmet-async"],
    resolve: {
      // `module-sync` / `module` point at the ESM builds of react-router v7,
      // otherwise the `node` condition resolves to CJS and named imports fail.
      conditions: ["module-sync", "module", "node", "import", "default"],
      externalConditions: ["module-sync", "module", "node", "import", "default"],
    },
  },
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["same-runtime/dist/jsx-dev-runtime", "same-runtime/dist/jsx-runtime"],
  },
});
