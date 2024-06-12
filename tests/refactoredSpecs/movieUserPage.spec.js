const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  visitUserPage,
  clickButton,
  linkIsVisible,
  buttonIsVisible,
  textIsVisible,
} = require("../helper");

const correctPassword = "Secret123";

describe("dealing with adding movies to user profile", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
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

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "tester", correctPassword);

        await page.waitForTimeout(1000);

        await textIsVisible(page, "Successfully logged in");
      });

      describe("adding a movie to user page", () => {
        beforeEach(async ({ page }) => {
          await page.goto("/movies/111");

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Scarface");
        });

        test("movie can be added to watch list", async ({ page }) => {
          // starts off not visible, not = true
          await buttonIsVisible(page, "Unwatch", true);

          await clickButton(page, "Watch");

          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unwatch");

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Watch List");

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from watch list", async ({ page }) => {
          await clickButton(page, "Watch");
          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unwatch");

          await page.waitForTimeout(1000);

          await clickButton(page, "Unwatch");

          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(
            page,
            "Successfully removed movie from your profile"
          );

          await textIsVisible(page, "Mr Tester");
          await expect(page.getByText("Watch List")).not.toBeVisible({
            timeout: 10000,
          });

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to favorite list", async ({ page }) => {
          await buttonIsVisible(page, "Unfavorite", true);

          await clickButton(page, "Favorite");
          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unfavorite");

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Favorite movies");

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from favorite list", async ({ page }) => {
          await clickButton(page, "Favorite");

          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unfavorite");

          await clickButton(page, "Unfavorite");

          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(
            page,
            "Successfully removed movie from your profile"
          );

          await textIsVisible(page, "Mr Tester");
          await expect(page.getByText("Favorite movies")).not.toBeVisible({
            timeout: 10000,
          });

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to seen list", async ({ page }) => {
          await buttonIsVisible(page, "Unsee", true);

          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unsee");

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Already seen");

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from seen list", async ({ page }) => {
          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unsee");

          await clickButton(page, "Unsee");
          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(
            page,
            "Successfully removed movie from your profile"
          );

          await textIsVisible(page, "Mr Tester");
          await expect(page.getByText("Already seen")).not.toBeVisible({
            timeout: 10000,
          });

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to multiple lists", async ({ page }) => {
          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);

          await clickButton(page, "Favorite");
          await page.waitForTimeout(1000);

          await clickButton(page, "Watch");
          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Watch List");
          await textIsVisible(page, "Favorite Movies");
          await textIsVisible(page, "Already seen");

          const movies = await page
            .getByRole("link", { name: "Scarface poster" })
            .all();
          expect(movies).toHaveLength(3);
        });

        test("movie can be removed from multiple lists", async ({ page }) => {
          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);

          await clickButton(page, "Favorite");
          await page.waitForTimeout(1000);

          await clickButton(page, "Watch");
          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unsee");
          await buttonIsVisible(page, "Unwatch");
          await buttonIsVisible(page, "Unfavorite");

          await clickButton(page, "Unsee");
          await page.waitForTimeout(1000);
          await clickButton(page, "Unwatch");
          await page.waitForTimeout(1000);
          await clickButton(page, "Unfavorite");
          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await page.waitForTimeout(1000);

          await expect(page.getByText("Watch List")).not.toBeVisible();
          await expect(page.getByText("Favorite Movies")).not.toBeVisible();
          await expect(page.getByText("Already seen")).not.toBeVisible();

          const movies = await page
            .getByRole("link", { name: "Scarface poster" })
            .all();
          expect(movies).toHaveLength(0);
        });
      });
    });
  });
});
