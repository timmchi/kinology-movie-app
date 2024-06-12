const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  clickLink,
  linkIsVisible,
  buttonIsVisible,
  textIsVisible,
} = require("../helper");

describe("elements in navbar", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
  });

  test("nav bar is visible on the front page", async ({ page }) => {
    await linkIsVisible(page, "Kinology");
    await linkIsVisible(page, "About");
    await linkIsVisible(page, "Log In");
    await linkIsVisible(page, "Sign Up");
  });

  test("registration form can be opened through navbar", async ({ page }) => {
    await clickLink(page, "Sign Up");

    await buttonIsVisible(page, "Sign Up");

    await textIsVisible(
      page,
      "UsernameNameEmailPasswordConfirm PasswordSign Up"
    );
  });

  test("login form can be opened through navbar", async ({ page }) => {
    await clickLink(page, "Log In");

    await buttonIsVisible(page, "Log In");
  });

  test("about section can be opened through nav bar", async ({ page }) => {
    await clickLink(page, "About");

    await textIsVisible(page, "About me");
    await textIsVisible(page, "Web app uses TMDB api");
    await textIsVisible(page, "Fullstack open");
  });
});
