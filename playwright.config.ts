import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const externalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
  },
  expect: {
    timeout: 10_000,
  },
  timeout: 30_000,
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: externalServer
    ? undefined
    : {
        command: `npm run build && npm run start -- --hostname 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          ...process.env,
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? baseURL,
        },
      },
});
