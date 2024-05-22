const { test, describe, expect } = require("playwright/test");

describe("Kinology", () => {
  test("front page can be opened", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const welcomeHeader = page.getByRole("heading", {
      name: "Welcome to Kinology",
    });
    const welcomeMessage = page.getByText("Choosing a movie made");

    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeHeader).toBeVisible();

    const registerMessage = page.getByText("Too many good options to");

    await expect(registerMessage).toBeVisible();
  });

  test("nav bar is visible on the front page", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const homeLink = page.getByRole("link", { name: "Kinology" });
    await expect(homeLink).toBeVisible();

    const aboutLink = page.getByRole("link", { name: "About" });
    await expect(aboutLink).toBeVisible();

    const loginLink = page.getByRole("link", { name: "Log In" });
    await expect(loginLink).toBeVisible();

    const signupLink = page.getByRole("link", { name: "Sign Up" });
    await expect(signupLink).toBeVisible();
  });

  test("registration form can be opened", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const registrationButton = page.getByRole("button", { name: "Register" });
    await registrationButton.click();
  });
});
