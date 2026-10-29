import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('full review on demo data: connect → customer → pillars → config → assess → verify → remediate → export', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Latest Helm chart/)).toBeVisible();
  await page.getByRole('button', { name: 'Use demo data' }).click();
  await page.getByLabel('Customer name').fill('Demo Retail');
  await page.getByLabel('Environment').fill('production');
  await page.getByPlaceholder('checkout, payment').fill('checkout,payment'); await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Continue to pillars' }).click();
  await expect(page.getByRole('button', { name: /Universal/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('checkbox', { name: 'Turn on' })).toBeChecked(); // Investigate with Claude is on by default
  await expect(page.getByText('span-metrics-bucket-optimizer')).toBeVisible();
  await page.getByRole('combobox').filter({ hasText: 'none / Coralogix-only' }).selectOption('Datadog');
  await page.getByRole('button', { name: 'Continue to config' }).click();
  await page.getByRole('button', { name: 'Paste the Kubernetes config instead' }).click();
  await page.getByLabel('Paste Kubernetes configuration').fill(readFileSync('../../fixtures/configs/helm-values-old.yaml', 'utf8'));
  await expect(page.getByText('Coralogix Helm values, chart version 0.0.300').first()).toBeVisible();
  await expect(page.getByText(/versions behind/).first()).toBeVisible();
  await expect(page.getByRole('radio', { name: '24 hours (default)' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('radiogroup', { name: 'Volume checks window' }).getByRole('radio', { name: '3 days' }).click();
  await page.getByRole('radiogroup', { name: 'Duplicate checks window' }).getByRole('radio', { name: '30 min' }).click();
  await expect(page.getByText('Data from the last 3 days')).toBeVisible();
  // custom date and time: invalid first, then a quick pick
  await page.getByRole('radio', { name: /Specific dates/ }).click();
  await page.getByLabel('Start').fill('2026-10-20T10:00'); await page.getByLabel('End').fill('2026-10-20T10:30');
  await expect(page.getByRole('alert').filter({ hasText: 'at least 1 hour' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run the assessment' })).toBeDisabled();
  await page.getByRole('button', { name: 'Yesterday' }).click();
  await expect(page.getByText(/24 hours in your time zone/)).toBeVisible();
  await page.getByRole('button', { name: 'Run the assessment' }).click();
  await expect(page.getByText(/discovery queries over data from/)).toBeVisible();
  const review = page.getByRole('button', { name: /^Review \d+ findings$/ });
  await expect(review).toBeEnabled({ timeout: 60000 });
  await expect(page.getByText('Assessment complete')).toBeVisible();
  await expect(page.getByText(/finding.*validated/)).toBeVisible();
  await review.click();
  // an Investigate finding: live samples, before/after, validation and savings maths
  await page.getByRole('button', { name: /Strip trace IDs written into the log text/ }).click();
  await expect(page.getByText('Found in live data').first()).toBeVisible();
  await expect(page.getByText('Validated against live data')).toBeVisible();
  await expect(page.getByText('Proposed transform')).toBeVisible();
  await expect(page.getByText('Estimated saving')).toBeVisible();
  await page.getByRole('button', { name: /Remove process_pid from process_cpu_utilization_1/ }).click();
  await expect(page.getByText(/Distinct values per label/)).toBeVisible();
  await expect(page.getByText(/count without \(process_pid\)/)).toBeVisible();
  await page.getByRole('button', { name: /histogram buckets/ }).click();
  await expect(page.getByText(/Latency per top service/)).toBeVisible();
  await page.getByRole('button', { name: /Protected label is being removed/ }).click();
  await expect(page.getByRole('region', { name: 'Value lens' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Protected label warning');
  await expect(page.getByRole('heading', { name: 'What’s happening' })).toBeVisible();
  await page.getByRole('list', { name: 'Findings' }).getByRole('button').first().click();
  for (let i = 0; i < 4; i++) { await page.keyboard.press('v'); await page.keyboard.press('j'); }
  await expect(page.getByText(/^\d+ verified$/)).toHaveText(/[4-9] verified/);
  await page.getByRole('button', { name: 'Continue to remediation' }).click();
  await expect(page.getByRole('region', { name: 'Phased roadmap' })).toBeVisible();
  await expect(page.getByText(/do not add their savings/).first()).toBeVisible();
  await page.getByRole('tab', { name: 'Config changes' }).click();
  await expect(page.getByText(/changed lines/)).toBeVisible();
  await page.getByRole('tab', { name: 'Upgrade' }).click();
  await expect(page.getByText('How to upgrade safely')).toBeVisible();
  await page.getByRole('tab', { name: 'Export' }).click();
  await page.getByRole('button', { name: 'Or pick individual files' }).click();
  await expect(page.getByText(/Customer report check passed/)).toBeVisible({ timeout: 60000 });
  for (const f of ['Demo Retail.html', 'Demo Retail.json', 'Demo Retail (internal).html', 'optimized-config.yaml', 'upgraded-config.yaml', 'breaking-changes.md', 'tco-policy-drafts.json']) await expect(page.getByText(f, { exact: true })).toBeVisible();
});
