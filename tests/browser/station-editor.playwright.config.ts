import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "station-editor-workbench.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium",
    viewport: { width: 1280, height: 800 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: { command: "npm run station:start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/component-editor", reuseExistingServer: false, timeout: 120_000 },
});
