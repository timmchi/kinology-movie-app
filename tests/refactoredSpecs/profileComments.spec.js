const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  visitUserPage,
  openCommentForm,
  clickButton,
  linkIsVisible,
  buttonIsVisible,
  textIsVisible,
} = require("../helper");

const correctPassword = "Secret123";

describe("dealing with profile comments", () => {
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

      describe("dealing with comments to a user page", () => {
        beforeEach(async ({ page }) => {
          await visitUserPage(page, "Mr Tester");

          await textIsVisible(page, "Mr Tester");
        });

        test("comment form can be opened", async ({ page }) => {
          await openCommentForm(page);

          const commentInput = page.getByLabel("Your comment");

          await expect(commentInput).toBeVisible();

          await buttonIsVisible(page, "Submit comment");
          await buttonIsVisible(page, "cancel");
        });

        test("comment form can be closed", async ({ page }) => {
          await openCommentForm(page);

          const commentInput = page.getByLabel("Your comment");

          await clickButton(page, "cancel");

          await buttonIsVisible(page, "Submit comment", true);
          await buttonIsVisible(page, "cancel", true);

          await expect(commentInput).not.toBeVisible();
        });

        test("user can leave a comment on his profile", async ({ page }) => {
          await openCommentForm(page);

          await postComment(page, "my comment");

          await page.waitForTimeout(1000);

          await textIsVisible(
            page,
            "Comment 'my comment' successfully created"
          );

          await linkIsVisible(page, "Mr Tester my comment");

          await buttonIsVisible(page, "edit comment");
          await buttonIsVisible(page, "Delete comment");
        });

        describe("and user profile has a comment left by profile owner", () => {
          beforeEach(async ({ page }) => {
            await openCommentForm(page);

            await postComment(page, "my comment");

            await page.waitForTimeout(1000);

            await textIsVisible(
              page,
              "Comment 'my comment' successfully created"
            );
          });

          test("a comment can be edited by its author", async ({ page }) => {
            await clickButton(page, "edit comment");

            const commentInput = page.getByRole("textbox", { name: "comment" });
            await commentInput.fill("it has been edited");

            await clickButton(page, "Submit comment");

            await page.waitForTimeout(1000);

            await textIsVisible(
              page,
              "Comment successfully updated with 'it has been edited'"
            );

            await linkIsVisible(page, "Mr Tester it has been edited");
          });

          test("a comment can be deleted by its author", async ({ page }) => {
            await deleteComment(page);

            await page.waitForTimeout(1000);

            await textIsVisible(page, "Comment successfully deleted");

            await linkIsVisible(page, "Mr tester my comment", true);
          });
        });
      });
    });
  });
});
