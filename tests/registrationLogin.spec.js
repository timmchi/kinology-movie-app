const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  registerWith,
  clickButton,
  buttonIsVisible,
  textIsVisible,
} = require("./helper");

const correctPassword = "Secret123";

describe("login form and registration form", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
  });

  test("registration form can be opened through CTA", async ({ page }) => {
    await clickButton(page, "Register");

    await buttonIsVisible(page, "Sign Up");

    await textIsVisible(
      page,
      "UsernameNameEmailPasswordConfirm PasswordSign Up"
    );
  });

  test("registration form can be filled and submitted", async ({ page }) => {
    await registerWith(
      page,
      "tester",
      "Mr Tester",
      "tester@example.com",
      correctPassword,
      correctPassword
    );

    await page.waitForTimeout(1000);

    await textIsVisible(page, "Sign up was successful, please log in");
    await buttonIsVisible(page, "Log In");
  });

  test("validation in registration form", async ({ page }) => {
    await registerWith(page, "", "", "", "", "");

    const usernameError = page.getByText("Please enter your username.");
    await expect(usernameError).toBeVisible();
    await expect(usernameError).toHaveCSS("color", "rgb(255, 0, 0)");

    const emailError = page.getByText("Please enter your email.");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveCSS("color", "rgb(255, 0, 0)");

    const nameError = page.getByText("Please enter your name or nickname.");
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveCSS("color", "rgb(255, 0, 0)");

    const passwordError = page.getByText("Please enter your password.");
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveCSS("color", "rgb(255, 0, 0)");

    const passwordConfirmError = page.getByText("Please confirm password");
    await expect(passwordConfirmError).toBeVisible();
    await expect(passwordConfirmError).toHaveCSS("color", "rgb(255, 0, 0)");
  });
});
