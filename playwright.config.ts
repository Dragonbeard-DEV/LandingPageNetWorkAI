import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3300);
const baseURL = `http://localhost:${PORT}`;

// Smoke tests run against `next dev`: without RESEND_API_KEY the contact API only reports success
// in development (it logs the lead instead), which is the behaviour the form test checks.
// Stop any other `next dev` for this project first: Next allows one dev server per project.
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `${baseURL}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { RESEND_API_KEY: "", CONTACT_FROM_EMAIL: "" },
  },
});
