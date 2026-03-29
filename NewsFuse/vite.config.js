import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Expose VITE_GROK_API_KEY from .env to the browser bundle
  envPrefix: "VITE_",
});
