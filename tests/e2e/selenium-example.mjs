import { Builder, By, until } from 'selenium-webdriver';

const driver = await new Builder().forBrowser('chrome').build();
try {
  await driver.get('http://127.0.0.1:4173/hci-lab-ia/#/lab');
  const heading = await driver.wait(until.elementLocated(By.css('h1')), 5000);
  if (!(await heading.getText()).includes('citas')) throw new Error('Primary flow not found');
} finally {
  await driver.quit();
}
