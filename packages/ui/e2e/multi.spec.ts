import { test, expect } from '@playwright/test';
import { readFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('customer with Kubernetes and ECS: a config per type, mismatch warning, per-type configs and zip folders', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Use demo data' }).click();
  await page.getByLabel('Customer name').fill('Multi Co');
  await page.getByText('ECS', { exact: true }).click(); // tick ECS as well as Kubernetes
  await expect(page.getByText(/Data checks run once for the whole team/)).toBeVisible();
  await page.getByRole('button', { name: 'Continue to pillars' }).click();
  await page.getByRole('button', { name: 'Continue to config' }).click();
  await expect(page.getByRole('region', { name: 'Kubernetes config' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'ECS config' })).toBeVisible();
  // wrong file in the ECS slot → warning; then the right one
  await page.getByRole('button', { name: 'Paste the ECS config instead' }).click();
  await page.getByLabel('Paste ECS configuration').fill(readFileSync('../../fixtures/configs/helm-values-old.yaml', 'utf8'));
  await expect(page.getByRole('alert').filter({ hasText: 'looks like Coralogix Helm values' })).toBeVisible();
  await page.getByLabel('Paste ECS configuration').fill(readFileSync('../../fixtures/configs/ecs-collector-0.98.yaml', 'utf8'));
  await expect(page.getByRole('alert').filter({ hasText: 'looks like' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Paste the Kubernetes config instead' }).click();
  await page.getByLabel('Paste Kubernetes configuration').fill(readFileSync('../../fixtures/configs/helm-values-old.yaml', 'utf8'));
  await page.getByRole('button', { name: 'Run the assessment' }).click();
  const review = page.getByRole('button', { name: /^Review \d+ findings$/ }); await expect(review).toBeEnabled({ timeout: 90000 }); await review.click();
  await expect(page.getByRole('button', { name: /^.*ECS: Upgrade to the latest/ }).first()).toBeVisible();
  await page.getByRole('list', { name: 'Findings' }).getByRole('button').first().click();
  for (let i = 0; i < 6; i++) { await page.keyboard.press('v'); await page.keyboard.press('j'); }
  await page.getByRole('button', { name: 'Continue to remediation' }).click();
  await page.getByRole('tab', { name: 'Config changes' }).click();
  await page.getByRole('radiogroup', { name: 'Deployment type' }).getByRole('radio', { name: /ECS/ }).click();
  await expect(page.getByText(/changed lines/)).toBeVisible();
  await page.getByRole('tab', { name: 'Export' }).click();
  const dl = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download all as draft (.zip)' }).click(); const file = await dl;
  const d = mkdtempSync(join(tmpdir(), 'mz-')); const p = join(d, 'x.zip'); await file.saveAs(p);
  const list = execFileSync('unzip', ['-l', p], { encoding: 'utf8' });
  for (const f of ['kubernetes/optimized-config.yaml', 'ecs/optimized-config.yaml', 'ecs/upgraded-config.yaml', 'ecs/breaking-changes.md', 'Multi Co (draft).html']) expect(list).toContain(f);
});
