import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwind()],
  build: { chunkSizeWarningLimit: 1200 },
  server: { host: "0.0.0.0", allowedHosts: true },
});
