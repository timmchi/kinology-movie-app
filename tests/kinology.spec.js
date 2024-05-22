const { test, describe, expect } = require("playwright/test");

describe("Kinology", () => {
  test("front page can be opened", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const logoLocator = await page.getByRole("link", { name: "Kinology" });
    await expect(logoLocator).toBeVisible();

    const welcomeLocator = await page.getByRole("heading", {
      name: "Welcome to Kinology",
    });
    await expect(welcomeLocator).toBeVisible();
  });
});
