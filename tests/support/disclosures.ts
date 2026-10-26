import type {Page} from '@playwright/test';

/** Include complementary content in audits even when its initial state is folded. */
export async function expandDisclosures(page:Page) {
  const ids=await page.locator('main .disclosure-toggle[aria-expanded="false"]').evaluateAll(nodes=>nodes.map(node=>node.id));
  for(const id of ids) {
    const trigger=page.locator(`[id="${id}"]`);
    // Opening an exclusive task can remove another card (for example saved bookings).
    if(await trigger.isVisible()&&await trigger.getAttribute('aria-expanded')==='false')await trigger.click();
  }
}
