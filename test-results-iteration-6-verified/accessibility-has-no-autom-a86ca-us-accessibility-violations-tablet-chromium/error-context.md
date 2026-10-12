# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> has no automatically detectable serious accessibility violations
- Location: tests\e2e\accessibility.spec.ts:4:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/lab
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/lab", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test('has no automatically detectable serious accessibility violations', async ({ page }) => {
> 5  |   await page.goto('/hci-lab-ia/#/lab');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/lab
  6  |   const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  7  |   const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  8  |   expect(serious).toEqual([]);
  9  | });
  10 | 
```