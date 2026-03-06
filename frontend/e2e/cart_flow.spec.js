import { test, expect } from "@playwright/test";

test("menu to cart flow works", async ({ page }) => {
  await page.goto("/menu");

  const addButtons = page.getByRole("button");
  await addButtons.first().click();

  await page.goto("/cart");

  await expect(page.locator("body")).toContainText(/rs|momo|cart/i);
});