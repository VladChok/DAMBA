import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '*.spec.js', fullyParallel: true, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', viewport: { width: 1440, height: 1000 }, launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined } },
  webServer: process.env.SKIP_TEST_SERVER ? undefined : { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  reporter: 'list'
});
