const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  heroPageVisible,
  clickButton,
  linkIsVisible,
  buttonIsVisible,
  textIsVisible,
} = require("../helper");

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

  describe("when registered", () => {
    beforeEach(async ({ page }) => {
      await registerWith(
        page,
        "tester",
        "Mr Tester",
        "tester@example.com",
        correctPassword,
        correctPassword
      );
    });

    test("failed registration when using same credentials as already registered user", async ({
      page,
    }) => {
      await page.waitForTimeout(1000);

      await textIsVisible(page, "Sign up was successful, please log in");

      await page.waitForTimeout(1000);

      await registerWith(
        page,
        "tester",
        "Mr Tester",
        "tester@example.com",
        correctPassword,
        correctPassword
      );

      await page.waitForTimeout(1000);

      await textIsVisible(page, "Something went wrong when signing up");
    });

    test("login form can be filled and submitted", async ({ page }) => {
      await loginWith(page, "tester", correctPassword);

      await page.waitForTimeout(1000);

      await textIsVisible(page, "Successfully logged in");

      await heroPageVisible(page);
    });

    test("failed log in attempt", async ({ page }) => {
      await loginWith(page, "tester", "Toster123");

      await page.waitForTimeout(1000);

      await textIsVisible(page, "Something went wrong");

      await linkIsVisible(page, "Log In");
      await linkIsVisible(page, "Sign Up");
    });

    test("validation in log in form", async ({ page }) => {
      await loginWith(page, "t", "s");

      const usernameError = page.getByText(
        "Username needs to be at least 3 characters long."
      );
      await expect(usernameError).toBeVisible();
      await expect(usernameError).toHaveCSS("color", "rgb(255, 0, 0)");

      const passwordError = page.getByText(
        "Your password must have 6 characters or more."
      );
      await expect(passwordError).toBeVisible();
      await expect(passwordError).toHaveCSS("color", "rgb(255, 0, 0)");
    });
  });
});
