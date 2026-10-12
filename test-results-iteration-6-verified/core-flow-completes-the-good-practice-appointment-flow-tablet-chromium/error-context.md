# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flow.spec.ts >> completes the good-practice appointment flow
- Location: tests\e2e\core-flow.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/lab
Call log:
  - navigating to "http://127.0.0.1:4173/hci-lab-ia/#/lab", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('completes the good-practice appointment flow', async ({ page }) => {
> 4  |   await page.goto('/hci-lab-ia/#/lab');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/hci-lab-ia/#/lab
  5  |   await page.getByLabel('Contexto', {exact:true}).selectOption('university');
  6  |   await page.getByLabel('Servicio', {exact:true}).selectOption('advice');
  7  |   await page.getByRole('button', { name: /continuar/i }).click();
  8  |   await page.getByLabel('Fecha').fill('2099-10-15');
  9  |   await page.getByLabel('Hora').selectOption('10:30');
  10 |   await page.getByRole('button', { name: /continuar/i }).click();
  11 |   await page.getByRole('button', { name: /confirmar reserva/i }).click();
  12 |   await expect(page.getByRole('status')).toContainText('Reserva confirmada');
  13 | });
  14 | 
  15 | test('switches between the four languages', async ({ page }) => {
  16 |   await page.goto('/hci-lab-ia/#/lab');
  17 |   await page.getByRole('combobox', { name: /idioma/i }).selectOption('en-US');
  18 |   await expect(page.getByRole('heading', { name: /Bookings in different contexts/i })).toBeVisible();
  19 | });
  20 | 
```