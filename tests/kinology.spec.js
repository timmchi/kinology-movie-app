const { test, describe, expect, beforeEach } = require("playwright/test");

describe("Kinology", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3001/api/testing/reset");

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

    await expect(
      page.getByText("Sign up was successful, please log in")
    ).toBeVisible();
    const loginButton = page.getByRole("button", { name: "Log In" });
    await expect(loginButton).toBeVisible();
  });

  test("validation in registration form", async ({ page }) => {
    const registrationButton = page.getByRole("button", { name: "Register" });
    await registrationButton.click();

    const signupButton = page.getByRole("button", { name: "Sign Up" });
    await signupButton.click();

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

  test("login form can be opened through navbar", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: "Log In" });
    await loginLink.click();

    const loginButton = page.getByRole("button", { name: "Log In" });
    await expect(loginButton).toBeVisible();
  });

  describe("when registered", () => {
    beforeEach(async ({ page }) => {
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

    test("failed registration in attempt", async ({ page }) => {
      await expect(
        page.getByText("Sign up was successful, please log in")
      ).toBeVisible();

      await page.getByRole("link", { name: "Sign Up" }).click();
      await page.getByTestId("username").fill("tester");
      await page.getByTestId("email").fill("tester@example.com");
      await page.getByTestId("name").fill("Mr Tester");
      await page.getByTestId("password").fill("secret");
      await page.getByTestId("password-confirm").fill("secret");

      const signupButton = page.getByRole("button", { name: "Sign Up" });
      await signupButton.click();

      await expect(
        page.getByText("Something went wrong when signing up")
      ).toBeVisible();
    });

    test("login form can be filled and submitted", async ({ page }) => {
      const loginLink = page.getByRole("link", { name: "Log In" });
      await loginLink.click();

      const usernameField = await page.getByTestId("username").fill("tester");
      const passwordField = await page.getByTestId("password").fill("secret");

      const loginButton = page.getByRole("button", { name: "Log In" });
      await loginButton.click();

      await expect(page.getByText("Successfully logged in")).toBeVisible();

      const welcomeHeader = page.getByRole("heading", {
        name: "Welcome to Kinology",
      });
      const welcomeMessage = page.getByText("Choosing a movie made");

      await expect(welcomeMessage).toBeVisible();
      await expect(welcomeHeader).toBeVisible();
    });

    test("failed log in attempt", async ({ page }) => {
      const loginLink = page.getByRole("link", { name: "Log In" });
      await loginLink.click();

      const usernameField = await page.getByTestId("username").fill("tester");
      const passwordField = await page.getByTestId("password").fill("toster");

      const loginButton = page.getByRole("button", { name: "Log In" });
      await loginButton.click();

      await expect(
        page.getByText("Something went wrong when logging in")
      ).toBeVisible();
      await expect(loginLink).toBeVisible();
      await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
    });

    test("validation in log in form", async ({ page }) => {});

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        const loginLink = page.getByRole("link", { name: "Log In" });
        await loginLink.click();

        const usernameField = await page.getByTestId("username").fill("tester");
        const passwordField = await page.getByTestId("password").fill("secret");

        const loginButton = page.getByRole("button", { name: "Log In" });
        await loginButton.click();
      });
    });
  });
});
