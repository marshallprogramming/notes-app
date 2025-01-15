import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";

interface VitestConfigExport extends UserConfig {
  test: {
    globals: boolean;
    environment: string;
    setupFiles: string;
  };
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
} as VitestConfigExport);
