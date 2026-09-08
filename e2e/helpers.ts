import { expect, type Locator, type Page } from "@playwright/test";

export async function firstVisible(
  page: Page,
  selectors: readonly string[],
): Promise<Locator | null> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) > 0 && (await locator.isVisible())) return locator;
  }
  return null;
}

export async function openDemo(page: Page): Promise<void> {
  await page.goto("/");
  const demoCta = await firstVisible(page, [
    '[data-testid="demo-cta"]',
    'a[href*="demo"]',
    'a[href*="dashboard"]',
    'button:has-text("Coba Demo")',
    'a:has-text("Coba Demo")',
    'button:has-text("Lihat Demo")',
    'a:has-text("Lihat Demo")',
  ]);

  expect(demoCta, "Landing page must expose a visible demo CTA").not.toBeNull();
  await demoCta!.click();
  await page.waitForLoadState("networkidle");
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(
    Math.max(metrics.document, metrics.body),
    `Page width ${Math.max(metrics.document, metrics.body)} exceeds viewport ${metrics.viewport}`,
  ).toBeLessThanOrEqual(metrics.viewport + 1);
}
