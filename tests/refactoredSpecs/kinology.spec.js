const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  movieButtonsVisible,
  logOut,
  visitUserPage,
  heroPageVisible,
  openCommentForm,
  clickButton,
  clickLink,
  linkIsVisible,
  buttonIsVisible,
  postCommentForUser,
  textIsVisible,
} = require("../helper");

const correctPassword = "Secret123";

describe("Kinology", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
  });

  test("front page can be opened", async ({ page }) => {
    await heroPageVisible(page);
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

      test("can log out", async ({ page }) => {
        await textIsVisible(page, "Successfully logged in");

        await logOut(page);

        await page.waitForTimeout(1000);

        await linkIsVisible(page, "Log In");
        await linkIsVisible(page, "Sign Up");
      });

      test("users link is visible and users page can be accessed", async ({
        page,
      }) => {
        await clickLink(page, "Users");

        await linkIsVisible(page, "Mr Tester");
      });

      test("user can access their own page and it renders correctly", async ({
        page,
      }) => {
        await visitUserPage(page, "Mr Tester");

        await textIsVisible(page, "Mr Tester");

        await buttonIsVisible(page, "Update Profile");

        await buttonIsVisible(page, "Delete User");
      });

      test("user can access a single movie page and movie buttons will be shown", async ({
        page,
      }) => {
        await page.goto("/movies/111");

        await textIsVisible(page, "Scarface");

        await movieButtonsVisible(page);
      });

      describe("and a search for movie Casino done", () => {
        beforeEach(async ({ page }) => {
          await clickButton(page, "Search");

          await clickButton(page, "Open Search");

          const genresSelector = page
            .locator("div")
            .filter({ hasText: /^Select genres$/ })
            .nth(2);

          await genresSelector.click();

          const crimeGenre = page.getByText("Crime");
          await crimeGenre.click();

          const directorInput = page.getByLabel("Director");
          await directorInput.fill("Scorsese");

          const yearInput = page.getByLabel("Year");
          await yearInput.fill("1995");

          const lowerRatingInput = page
            .locator("span")
            .filter({ hasText: /^0$/ })
            .first();

          const lowerRatingInputOffsetWidth = await lowerRatingInput.evaluate(
            (e) => {
              return e.getBoundingClientRect().width;
            }
          );

          await lowerRatingInput.click({
            force: true,
            position: { x: lowerRatingInputOffsetWidth / 1.5, y: 0 },
          });

          const higherRatingInput = page
            .locator("span")
            .filter({ hasText: "10" })
            .first();

          const higherRatingInputOffsetWidth = await higherRatingInput.evaluate(
            (e) => {
              return e.getBoundingClientRect().width;
            }
          );

          await higherRatingInput.click({
            force: true,
            position: { x: higherRatingInputOffsetWidth, y: 0 },
          });

          const countryInput = page.getByLabel("Country");
          await countryInput.fill("United States of America");

          const searchMoviesButton = page.getByLabel("Search for movies");
          await searchMoviesButton.click();

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Casino");
        });

        test("movie buttons on a movie card are visible to a logged in user", async ({
          page,
        }) => {
          await movieButtonsVisible(page);
        });
      });
    });

    describe("and there is one more registered user", () => {
      beforeEach(async ({ page }) => {
        await page.waitForTimeout(1000);

        await textIsVisible(page, "Sign up was successful, please log in");

        await registerWith(
          page,
          "toster",
          "Ms Toster",
          "toster@example.com",
          correctPassword,
          correctPassword
        );
      });

      test("and another user can log in", async ({ page }) => {
        await loginWith(page, "toster", correctPassword);

        await page.waitForTimeout(1000);

        await textIsVisible(page, "Successfully logged in");
      });

      describe("and another user has logged in", () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, "toster", correctPassword);

          await page.waitForTimeout(1000);

          await textIsVisible(page, "Successfully logged in");
        });

        test("another user is visible in user list", async ({ page }) => {
          await clickLink(page, "Users");

          await linkIsVisible(page, "Ms Toster");
        });

        test("a user can leave a comment on another user profile", async ({
          page,
        }) => {
          await visitUserPage(page, "Mr Tester");

          await textIsVisible(page, "Mr Tester");

          await openCommentForm(page);

          await postComment(page, "Another user was here");

          await page.waitForTimeout(1000);

          await textIsVisible(
            page,
            "Comment 'Another user was here' successfully created"
          );

          await linkIsVisible(page, "Ms Toster Another user was here");

          await buttonIsVisible(page, "edit comment");

          await buttonIsVisible(page, "Delete comment");
        });

        describe("a second user created a comment in their own profile and another user profile, logged in with another user", () => {
          beforeEach(async ({ page }) => {
            await postCommentForUser(
              page,
              "Mr Tester",
              "Another user was here"
            );

            await postCommentForUser(
              page,
              "Ms Toster",
              "This is my own profile"
            );

            // logging out
            await logOut(page);

            // logging in to another profile
            await loginWith(page, "tester", correctPassword);

            await page.waitForTimeout(1000);

            await textIsVisible(page, "Successfully logged in");
          });

          test("a user can not edit a comment on another user profile", async ({
            page,
          }) => {
            await visitUserPage(page, "Ms Toster");

            await linkIsVisible(page, "Ms Toster This is my own");

            await buttonIsVisible(page, "edit comment", true);
          });

          test("a user can not delete a comment on another user profile if they are not the author", async ({
            page,
          }) => {
            await visitUserPage(page, "Ms Toster");

            await linkIsVisible(page, "Ms Toster This is my own");

            await buttonIsVisible(page, "Delete comment", true);
          });

          test("a user can not edit a comment on their profile if they are not the comments author", async ({
            page,
          }) => {
            await visitUserPage(page, "Mr Tester");

            await textIsVisible(page, "Another user was here");

            await buttonIsVisible(page, "edit comment", true);
          });

          test("a user can delete a comment on their profile even if they are not the author", async ({
            page,
          }) => {
            await visitUserPage(page, "Mr Tester");

            await textIsVisible(page, "Another user was here");

            await deleteComment(page);

            await page.waitForTimeout(1000);

            await textIsVisible(page, "Comment successfully deleted");
            await expect(
              page.getByText("Another user was here")
            ).not.toBeVisible();
          });
        });
      });
    });
  });
});
