import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.{js,ts,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
