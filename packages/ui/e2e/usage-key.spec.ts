import { test, expect } from '@playwright/test';
test('a saved metric usage key is offered from a dropdown next time', async ({ page }, info) => {
  test.skip(info.project.name !== 'light', 'one theme is enough for this flow');
  await page.goto('/');
  await page.getByLabel('Team').selectOption({ index: 1 });
  const box = page.getByLabel('Saved metric usage key');
  await expect(box).toBeVisible();
  if ((await box.inputValue()) !== '__add') await box.selectOption('__add');
  await page.getByPlaceholder(/– DataAnalytics/).fill('Test team – DataAnalytics');
  await page.locator('input[type=password]').first().fill('not-a-real-key');
  await page.getByRole('button', { name: /Save and use for/ }).click();
  await expect(page.getByText('Using a saved key')).toBeVisible();
  await page.reload(); await page.getByLabel('Team').selectOption({ index: 1 });
  await expect(page.getByLabel('Saved metric usage key')).toHaveValue(/^[0-9a-f-]{8}$/); // remembered, no re-entry
  await expect(page.getByLabel('Saved metric usage key').locator('option', { hasText: 'Test team – DataAnalytics' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete this key' }).click();
  await expect(page.getByText('Using a saved key')).toHaveCount(0);
});
