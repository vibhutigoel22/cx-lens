import { defineConfig } from '@playwright/test';
// Starts the local API (which serves the built UI) and runs the full review flow on demo data, light and dark.
export default defineConfig({
  testDir: 'e2e', timeout: 120000,
  webServer: { command: 'node ../api/dist/server.js', env: { CXLENS_PORT: '4329', CXLENS_HOME: '/tmp/cxlens-e2e', CXLENS_DEV_SECRET_FILE: '/tmp/cxlens-e2e/dev-secrets.json' }, url: 'http://127.0.0.1:4329/', reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:4329/', viewport: { width: 1360, height: 900 } },
  projects: [{ name: 'light', use: { colorScheme: 'light' } }, { name: 'dark', use: { colorScheme: 'dark' } }],
});
