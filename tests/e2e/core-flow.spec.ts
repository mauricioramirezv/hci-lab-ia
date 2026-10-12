import { test, expect } from '@playwright/test';

test('completes the good-practice appointment flow', async ({ page }) => {
  await page.goto('/hci-lab-ia/#/lab');
  await page.getByLabel('Contexto', {exact:true}).selectOption('university');
  await page.getByLabel('Servicio', {exact:true}).selectOption('advice');
  await page.getByRole('button', { name: /continuar/i }).click();
  await page.getByLabel('Fecha').fill('2099-10-15');
  await page.getByLabel('Hora').selectOption('10:30');
  await page.getByRole('button', { name: /continuar/i }).click();
  await page.getByRole('button', { name: /confirmar reserva/i }).click();
  await expect(page.getByRole('status')).toContainText('Reserva confirmada');
});

test('switches between the four languages', async ({ page }) => {
  await page.goto('/hci-lab-ia/#/lab');
  await page.getByRole('combobox', { name: /idioma/i }).selectOption('en-US');
  await expect(page.getByRole('heading', { name: /Bookings in different contexts/i })).toBeVisible();
});
