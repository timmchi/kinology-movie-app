const { test, describe, expect, beforeEach } = require("playwright/test");
const { clickButton, clickLink, textIsVisible } = require("../helper");

describe("about page ", () => {
  beforeEach(async ({ page }) => {
    await page.goto("/");
    await clickLink(page, "About");

    await textIsVisible(page, "About me");
  });

  test("contact form can be opened and has all fields", async ({ page }) => {
    await page.getByText("About me").hover();

    await clickButton(page, "Contact Me");

    const nameInput = page.getByLabel("Name");
    const emailInput = page.getByLabel("Email");
    const messageInput = page.getByLabel("Your message");

    const submitButton = page.getByLabel("Submit message");

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  describe("and contact modal is open", () => {
    beforeEach(async ({ page }) => {
      await page.getByText("About me").hover();

      await clickButton(page, "Contact Me");
    });

    test("contact form can be filled and submitted", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      const emailInput = page.getByLabel("Email");
      const messageInput = page.getByLabel("Your message");

      const submitButton = page.getByLabel("Submit message");

      await nameInput.fill("Tester");
      await emailInput.fill("tester@example.com");
      await messageInput.fill("I am testing this sites functionality");

      await submitButton.click();

      await page.waitForTimeout(3000);

      await expect(nameInput).not.toBeVisible({ timeout: 15000 });
      await expect(emailInput).not.toBeVisible({ timeout: 15000 });
      await expect(messageInput).not.toBeVisible({ timeout: 15000 });
      await expect(submitButton).not.toBeVisible({ timeout: 15000 });
    });

    test("validation in contact form", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      const emailInput = page.getByLabel("Email");
      const messageInput = page.getByLabel("Your message");

      const submitButton = page.getByLabel("Submit message");

      await nameInput.fill("a");
      await emailInput.fill("a");
      await messageInput.fill("a");

      await submitButton.click();

      await textIsVisible(page, "Name or nickname should be 3 or more symbols");
      await textIsVisible(page, "The email address is badly formatted");
      await textIsVisible(page, "Message should be 3 or more symbols");
    });
  });
});
