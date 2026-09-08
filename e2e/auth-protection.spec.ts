import { expect, test } from "@playwright/test";

const hasProductionAuthCredentials = Boolean(
  process.env.E2E_USER_EMAIL && process.env.E2E_USER_PASSWORD,
);

test("direct dashboard access follows the protected-route contract", async ({
  page,
}) => {
  const response = await page.goto("/dashboard");
  expect(response?.status() ?? 200).toBeLessThan(500);
  await page.waitForLoadState("networkidle");

  const pathname = new URL(page.url()).pathname;
  const redirectedToAuth = /\/(?:masuk|daftar|login|sign-in|auth)(?:\/|$)/u.test(pathname);
  const explicitDemo =
    /\/(?:demo)(?:\/|$)/u.test(pathname) ||
    (await page.locator('[data-demo="true"], [data-testid="demo-dashboard"]').count()) > 0;

  expect(
    redirectedToAuth || explicitDemo,
    "Anonymous /dashboard access must redirect to auth or explicitly render isolated demo data",
  ).toBe(true);
});

test("authenticated production dashboard smoke test", async ({ page }) => {
  test.skip(
    !hasProductionAuthCredentials,
    "E2E_USER_EMAIL and E2E_USER_PASSWORD are absent; production auth is not exercised",
  );

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(process.env.E2E_USER_EMAIL!);
  await page.getByLabel(/password|kata sandi/i).fill(process.env.E2E_USER_PASSWORD!);
  await page.getByRole("button", { name: /masuk|sign in|login/i }).click();

  await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/u);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByText(/error|gagal memuat/i)).toHaveCount(0);
});
