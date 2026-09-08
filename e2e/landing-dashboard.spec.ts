import { expect, test } from "@playwright/test";
import { firstVisible, openDemo } from "./helpers";

test("landing page explains the product and opens the demo", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1").first()).toBeVisible();
  const demoCta = await firstVisible(page, [
    '[data-testid="demo-cta"]',
    'a[href*="demo"]',
    'a[href*="dashboard"]',
    'button:has-text("Coba Demo")',
    'a:has-text("Coba Demo")',
    'button:has-text("Lihat Demo")',
    'a:has-text("Lihat Demo")',
  ]);
  expect(demoCta, "Landing page must have a demo CTA").not.toBeNull();
  await expect(demoCta!).toBeEnabled();

  await openDemo(page);
  await expect(page).toHaveURL(/\/(?:demo|dashboard)(?:[/?#]|$)/u);
  await expect(page.locator("main")).toBeVisible();
});

test("demo dashboard filters and searches visible records", async ({ page }) => {
  await openDemo(page);

  const filter = await firstVisible(page, [
    '[data-testid="dashboard-filter"]',
    'select[aria-label*="filter" i]',
    'button[aria-label*="filter" i]',
    'button:has-text("Filter")',
  ]);
  expect(filter, "Dashboard must expose a filter control").not.toBeNull();

  if ((await filter!.evaluate((element) => element.tagName)) === "SELECT") {
    const options = filter!.locator("option:not([disabled])");
    expect(await options.count()).toBeGreaterThan(1);
    const value = await options.nth(1).getAttribute("value");
    if (value) await filter!.selectOption(value);
  } else {
    await filter!.click();
    const option = page
      .locator('[role="option"], [role="menuitemcheckbox"], [role="menuitemradio"]')
      .first();
    await expect(option).toBeVisible();
    await option.click();
  }

  const search = await firstVisible(page, [
    '[data-testid="dashboard-search"]',
    'input[type="search"]',
    'input[placeholder*="cari" i]',
    'input[aria-label*="cari" i]',
    'input[aria-label*="search" i]',
  ]);
  expect(search, "Dashboard must expose a search field").not.toBeNull();

  const rows = page.locator(
    '[data-testid="transaction-row"]:visible, table tbody tr:visible, [role="rowgroup"] [role="row"]:visible',
  );
  await expect(rows.first()).toBeVisible();
  const query = (await rows.first().innerText()).split(/\s+/u).find((word) => word.length >= 3);
  expect(query, "A demo row must contain searchable text").toBeTruthy();

  await search!.fill(query!);
  await expect(rows.first()).toContainText(query!, { ignoreCase: true });

  await search!.fill("__tidak_ada_transaksi_demo__");
  await expect(rows).toHaveCount(0);
});
