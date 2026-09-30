import { test, expect } from '@playwright/test';

test('completes the good-practice appointment flow', async ({ page }) => {
  await page.goto('/hci-lab-ia/#/lab');
  await page.getByLabel('Servicio').selectOption({ label: 'Orientación UX' });
  await page.getByRole('button', { name: /continuar/i }).click();
  await page.getByLabel('Fecha').fill('2026-10-15');
  await page.getByLabel('Hora').selectOption('10:30');
  await page.getByRole('button', { name: /continuar/i }).click();
  await page.getByRole('button', { name: /confirmar cita/i }).click();
  await expect(page.getByRole('status')).toContainText('Cita confirmada');
});

test('switches between the four languages', async ({ page }) => {
  await page.goto('/hci-lab-ia/#/lab');
  await page.getByRole('combobox', { name: /idioma/i }).selectOption('en-US');
  await expect(page.getByRole('heading', { name: /appointment booking flow/i })).toBeVisible();
});
