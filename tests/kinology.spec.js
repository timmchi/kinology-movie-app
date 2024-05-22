const { beforeEach } = require("node:test");
const { test, describe, expect } = require("playwright/test");

describe("Kinology", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("front page can be opened", async ({ page }) => {
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
    const homeLink = page.getByRole("link", { name: "Kinology" });
    await expect(homeLink).toBeVisible();

    const aboutLink = page.getByRole("link", { name: "About" });
    await expect(aboutLink).toBeVisible();

    const loginLink = page.getByRole("link", { name: "Log In" });
    await expect(loginLink).toBeVisible();

    const signupLink = page.getByRole("link", { name: "Sign Up" });
    await expect(signupLink).toBeVisible();
  });

  test("registration form can be opened through CTA", async ({ page }) => {
    const registrationButton = page.getByRole("button", { name: "Register" });
    await registrationButton.click();

    const registrationFormFields = page.getByText(
      "usernameemailnamepasswordconfirm passwordSign Up"
    );
    const signupButton = page.getByRole("button", { name: "Sign Up" });

    await expect(registrationFormFields).toBeVisible();
    await expect(signupButton).toBeVisible();
  });

  test("registration form can be opened through navbar", async ({ page }) => {
    const signupLink = page.getByRole("link", { name: "Sign Up" });
    await signupLink.click();

    const registrationFormFields = page.getByText(
      "usernameemailnamepasswordconfirm passwordSign Up"
    );
    const signupButton = page.getByRole("button", { name: "Sign Up" });

    await expect(registrationFormFields).toBeVisible();
    await expect(signupButton).toBeVisible();
  });

  test("registration form can be filled and submitted", async ({ page }) => {
    const registrationButton = page.getByRole("button", { name: "Register" });
    await registrationButton.click();

    const usernameField = await page.getByTestId("username").fill("tester");
    const emailField = await page
      .getByTestId("email")
      .fill("tester@example.com");
    const nameField = await page.getByTestId("name").fill("Mr Tester");
    const password = await page.getByTestId("password").fill("secret");
    const passwordConfirm = await page
      .getByTestId("password-confirm")
      .fill("secret");

    const signupButton = page.getByRole("button", { name: "Sign Up" });
    await signupButton.click();
  });
});
