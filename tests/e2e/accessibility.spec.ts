import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no automatically detectable serious accessibility violations', async ({ page }) => {
  await page.goto('/hci-lab-ia/#/lab');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  expect(serious).toEqual([]);
});
