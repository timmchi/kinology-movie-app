const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  clickButton,
  linkIsVisible,
  textIsVisible,
} = require("../helper");

const correctPassword = "Secret123";

describe("dealing with movie comments", () => {
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

      describe("dealing with comments to a movie page", () => {
        beforeEach(async ({ page }) => {
          await page.goto("/movies/111");

          await textIsVisible(page, "Scarface");
        });

        test("a user can add comments to a movie", async ({ page }) => {
          //   await expect(page.getByText("no comments yet...")).toBeVisible();
          await textIsVisible(page, "no comments yet...");

          await postComment(page, "I love this movie");

          await textIsVisible(
            page,
            "Comment 'I love this movie' successfully added"
          );

          await linkIsVisible(page, "Mr Tester I love this movie");

          await expect(page.getByText("no comments yet...")).not.toBeVisible();
        });

        describe("and a comment was added to a movie", () => {
          beforeEach(async ({ page }) => {
            await postComment(page, "I love this movie");

            await page.waitForTimeout(1000);

            await textIsVisible(
              page,
              "Comment 'I love this movie' successfully added"
            );
          });

          test("comment author can edit their comment", async ({ page }) => {
            await clickButton(page, "edit comment");

            const editCommentInput = page.getByLabel("Edit your comment");

            const submitEditButton = page
              .locator("form")
              .filter({ hasText: "Edit your commentEdit your" })
              .getByLabel("Submit comment");
            await editCommentInput.fill("Al Pacino rocks");
            await submitEditButton.click();

            await page.waitForTimeout(1000);

            await textIsVisible(page, "Al Pacino rocks");
            await textIsVisible(page, "Comment successfully updated");
          });

          test("comment author can delete their comment", async ({ page }) => {
            await deleteComment(page);

            await page.waitForTimeout(1000);

            await textIsVisible(page, "Comment successfully deleted");
            await expect(page.getByText("I love this movie")).not.toBeVisible();

            await textIsVisible(page, "no comments yet...");
          });
        });
      });
    });
  });
});
