import { test, expect } from '@playwright/test';
import { readFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('save a draft at any stage, start over, resume it, then download everything as a draft zip', async ({ page }, info) => {
  const name = `Draft Co ${info.project.name} ${Date.now().toString(36)}`;
  await page.goto('/');
  await page.getByRole('button', { name: 'Use demo data' }).click();
  await page.getByLabel('Customer name').fill(name);
  await page.getByRole('button', { name: 'Continue to pillars' }).click();
  // save mid-way (keyboard shortcut), then start over
  await page.keyboard.press('ControlOrMeta+s');
  await expect(page.getByRole('status')).toContainText('Draft saved');
  await page.getByRole('button', { name: 'Start a new review' }).first().click();
  await expect(page.getByRole('dialog')).toContainText('Your draft is saved');
  await page.getByRole('button', { name: 'Save and start over' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connect');
  // resume from the drafts list
  const row = page.getByRole('listitem').filter({ hasText: name });
  await expect(row).toContainText('Step 3: Choose pillars');
  await row.getByRole('button', { name: 'Resume' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose pillars');
  await expect(page.getByText(name).first()).toBeVisible();
  // finish the review
  await page.getByRole('button', { name: 'Continue to config' }).click();
  await page.getByRole('button', { name: 'Paste the Kubernetes config instead' }).click();
  await page.getByLabel('Paste Kubernetes configuration').fill(readFileSync('../../fixtures/configs/helm-values-old.yaml', 'utf8'));
  await page.getByRole('button', { name: 'Run the assessment' }).click();
  const review = page.getByRole('button', { name: /^Review \d+ findings$/ }); await expect(review).toBeEnabled({ timeout: 60000 }); await review.click();
  await page.getByRole('button', { name: 'Continue to remediation' }).click();
  await page.getByRole('tab', { name: 'Export' }).click();
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download all as draft (.zip)' }).click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe(`${name} (draft).zip`);
  const d = mkdtempSync(join(tmpdir(), 'dl-')); const p = join(d, 'x.zip'); await file.saveAs(p);
  const list = execFileSync('unzip', ['-l', p], { encoding: 'utf8' });
  for (const f of [`${name} (draft).html`, `${name} (internal, draft).html`, `${name} (draft).json`, 'optimized-config.yaml']) expect(list).toContain(f);
  // the end-of-review button returns to Connect
  await page.getByRole('button', { name: 'Start a new review' }).last().click();
  await page.getByRole('button', { name: 'Save and start over' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connect');
  // tidy up the draft created by this test
  const del = page.getByRole('button', { name: `Delete draft ${name}` }); if (await del.count()) await del.click();
});
