import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, firstVisible, openDemo } from "./helpers";

test("theme control changes and persists the selected theme", async ({ page }) => {
  await page.goto("/");

  const toggle = await firstVisible(page, [
    '[data-testid="theme-toggle"]',
    'button[aria-label*="tema" i]',
    'button[aria-label*="theme" i]',
    'button:has-text("Tema")',
  ]);
  expect(toggle, "Application must expose an accessible theme control").not.toBeNull();

  const before = await page.locator("html").getAttribute("class");
  const beforeScheme = await page.evaluate(
    () => document.documentElement.style.colorScheme,
  );
  await toggle!.click();
  await expect
    .poll(async () => ({
      className: await page.locator("html").getAttribute("class"),
      colorScheme: await page.evaluate(
        () => document.documentElement.style.colorScheme,
      ),
    }))
    .not.toEqual({ className: before, colorScheme: beforeScheme });

  const selected = await page.locator("html").getAttribute("class");
  const selectedScheme = await page.evaluate(
    () => document.documentElement.style.colorScheme,
  );
  await page.reload();

  expect({
    className: await page.locator("html").getAttribute("class"),
    colorScheme: await page.evaluate(
      () => document.documentElement.style.colorScheme,
    ),
  }).toEqual({ className: selected, colorScheme: selectedScheme });
});

test("landing and demo avoid horizontal page overflow", async ({ page }, testInfo) => {
  test.skip(
    !testInfo.project.name.includes("mobile"),
    "Overflow assertion targets the mobile project",
  );

  await page.goto("/");
  await expectNoHorizontalOverflow(page);

  await openDemo(page);
  await expectNoHorizontalOverflow(page);
});
