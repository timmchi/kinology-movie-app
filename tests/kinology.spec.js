const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  editComment,
} = require("./helper");

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
    await registerWith(
      page,
      "tester",
      "Mr Tester",
      "tester@example.com",
      "secret",
      "secret"
    );

    await expect(
      page.getByText("Sign up was successful, please log in")
    ).toBeVisible();
    const loginButton = page.getByRole("button", { name: "Log In" });
    await expect(loginButton).toBeVisible();
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

  test("login form can be opened through navbar", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: "Log In" });
    await loginLink.click();

    const loginButton = page.getByRole("button", { name: "Log In" });
    await expect(loginButton).toBeVisible();
  });

  describe("when registered", () => {
    beforeEach(async ({ page }) => {
      await registerWith(
        page,
        "tester",
        "Mr Tester",
        "tester@example.com",
        "secret",
        "secret"
      );
    });

    test("failed registration when using same credentials as already registered user", async ({
      page,
    }) => {
      await expect(
        page.getByText("Sign up was successful, please log in")
      ).toBeVisible();

      await registerWith(
        page,
        "tester",
        "Mr Tester",
        "tester@example.com",
        "secret",
        "secret"
      );

      await expect(
        page.getByText("Something went wrong when signing up")
      ).toBeVisible();
    });

    test("login form can be filled and submitted", async ({ page }) => {
      await loginWith(page, "tester", "secret");

      await expect(page.getByText("Successfully logged in")).toBeVisible();

      const welcomeHeader = page.getByRole("heading", {
        name: "Welcome to Kinology",
      });
      const welcomeMessage = page.getByText("Choosing a movie made");

      await expect(welcomeMessage).toBeVisible();
      await expect(welcomeHeader).toBeVisible();
    });

    test("failed log in attempt", async ({ page }) => {
      await loginWith(page, "tester", "toster");

      await expect(
        page.getByText("Something went wrong when logging in")
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "Log In" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
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

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "tester", "secret");

        await expect(page.getByText("Successfully logged in")).toBeVisible();
      });

      test("can log out", async ({ page }) => {
        await expect(page.getByText("Successfully logged in")).toBeVisible();

        const logoutButton = page.getByRole("button", { name: "log out" });
        await logoutButton.click();

        const loginLink = page.getByRole("link", { name: "Log In" });
        const signupLink = page.getByRole("link", { name: "Sign Up" });

        await expect(loginLink).toBeVisible();
        await expect(signupLink).toBeVisible();
      });

      test("users link is visible and users page can be accessed", async ({
        page,
      }) => {
        const usersLink = page.getByRole("link", { name: "Users" });
        await usersLink.click();

        const userPageLink = page.getByRole("link", { name: "Mr Tester" });
        expect(userPageLink).toBeVisible();
      });

      test("user can access their own page and it renders correctly", async ({
        page,
      }) => {
        const usersLink = page.getByRole("link", { name: "Users" });
        await usersLink.click();

        const userPageLink = page.getByRole("link", { name: "Mr Tester" });
        await userPageLink.click();

        await expect(page.getByText("Mr Tester")).toBeVisible();

        const updateButton = page.getByRole("button", {
          name: "Update Profile",
        });
        await expect(updateButton).toBeVisible();

        const deleteButton = page.getByRole("button", {
          name: "Delete User",
        });
        await expect(deleteButton).toBeVisible();
      });

      test("user can access a single movie page and movie buttons will be shown", async ({
        page,
      }) => {
        await page.goto("http://localhost:5173/movies/111");

        const title = page.getByText("Scarface");
        await expect(title).toBeVisible();

        const watchButton = page.getByRole("button", { name: "Watch" });
        await expect(watchButton).toBeVisible();

        const favoriteButton = page.getByRole("button", { name: "Favorite" });
        await expect(favoriteButton).toBeVisible();

        const seenButton = page.getByRole("button", { name: "Seen" });
        await expect(seenButton).toBeVisible();
      });

      describe("and a search for movie Casino done", () => {
        beforeEach(async ({ page }) => {
          const searchCTAButton = page.getByRole("button", {
            name: "search",
            exact: true,
          });

          await searchCTAButton.click();

          const genresSelector = page
            .locator("div")
            .filter({ hasText: /^Select genres$/ })
            .nth(2);

          await genresSelector.click();

          const crimeGenre = page.getByText("Crime");
          await crimeGenre.click();
          // await expect(page.getByText("Crime")).toBeVisible();

          const directorInput = page.getByPlaceholder("director");
          await directorInput.fill("Scorsese");

          const yearInput = page.getByPlaceholder("year");
          await yearInput.fill("1995");

          const lowerRatingInput = page.getByPlaceholder("Lower threshold");
          await lowerRatingInput.fill("7");

          const higherRatingInput = page.getByPlaceholder("Upper threshold");
          await higherRatingInput.fill("9");

          const countryInput = page.getByPlaceholder("country");
          await countryInput.fill("United States of America");

          const searchMoviesButton = page.getByLabel("Search for movies");
          await searchMoviesButton.click();

          await expect(page.getByText("Casino")).toBeVisible();
        });

        test("movie buttons on a movie card are visible to a logged in user", async ({
          page,
        }) => {
          const watchButton = page.getByRole("button", { name: "Watch" });
          await expect(watchButton).toBeVisible();

          const favoriteButton = page.getByRole("button", { name: "Favorite" });
          await expect(favoriteButton).toBeVisible();

          const seenButton = page.getByRole("button", { name: "Seen" });
          await expect(seenButton).toBeVisible();
        });
      });

      describe("dealing with comments to a user page", () => {
        beforeEach(async ({ page }) => {
          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Mr Tester")).toBeVisible();
        });

        test("comment form can be opened", async ({ page }) => {
          const openCommentButton = page.getByRole("button", {
            name: "leave a comment",
          });
          await openCommentButton.click();

          const commentInput = page.getByPlaceholder("comment");
          const commentInputText = page.getByText("Your comment");

          await expect(commentInput).toBeVisible();
          await expect(commentInputText).toBeVisible();

          const submitCommentButton = page.getByRole("button", {
            name: "Submit comment",
          });
          const closeCommentButton = page.getByRole("button", {
            name: "cancel",
          });

          await expect(submitCommentButton).toBeVisible();
          await expect(closeCommentButton).toBeVisible();
        });

        test("comment form can be closed", async ({ page }) => {
          const openCommentButton = page.getByRole("button", {
            name: "leave a comment",
          });
          await openCommentButton.click();

          const commentInput = page.getByPlaceholder("comment");
          const commentInputText = page.getByText("Your comment");

          const submitCommentButton = page.getByRole("button", {
            name: "Submit comment",
          });
          const closeCommentButton = page.getByRole("button", {
            name: "cancel",
          });

          await closeCommentButton.click();

          await expect(commentInput).not.toBeVisible();
          await expect(commentInputText).not.toBeVisible();
          await expect(submitCommentButton).not.toBeVisible();
          await expect(closeCommentButton).not.toBeVisible();
        });

        test("user can leave a comment on his profile", async ({ page }) => {
          const openCommentButton = page.getByRole("button", {
            name: "leave a comment",
          });
          await openCommentButton.click();

          await postComment(page, "my comment");

          await expect(
            page.getByText("Comment 'my comment' successfully created")
          ).toBeVisible();

          await expect(
            page.getByRole("link", { name: "Mr Tester my comment" })
          ).toBeVisible();

          const editCommentButton = page.getByRole("button", {
            name: "edit comment",
          });
          await expect(editCommentButton).toBeVisible();

          const deleteCommentButton = page.getByRole("button", {
            name: "Delete comment",
          });
          await expect(deleteCommentButton).toBeVisible();
        });

        describe("and user profile has a comment left by profile owner", () => {
          beforeEach(async ({ page }) => {
            const openCommentButton = page.getByRole("button", {
              name: "leave a comment",
            });
            await openCommentButton.click();

            await postComment(page, "my comment");

            await expect(
              page.getByText("Comment 'my comment' successfully created")
            ).toBeVisible();
          });

          test("a comment can be edited by its author", async ({ page }) => {
            const editCommentButton = page.getByRole("button", {
              name: "edit comment",
            });
            await editCommentButton.click();

            const submitCommentButton = page.getByRole("button", {
              name: "Submit comment",
            });

            const commentInput = page.getByRole("textbox", { name: "comment" });
            await commentInput.fill("it has been edited");

            await submitCommentButton.click();

            await expect(
              page.getByText(
                "Comment successfully updated with 'it has been edited'"
              )
            ).toBeVisible();
            await expect(
              page.getByRole("link", { name: "Mr Tester it has been edited" })
            ).toBeVisible();
          });

          test("a comment can be deleted by its author", async ({ page }) => {
            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible();

            await expect(
              page.getByRole("link", { name: "Mr Tester my comment" })
            ).not.toBeVisible();
          });
        });
      });

      describe("adding a movie to user page", () => {
        beforeEach(async ({ page }) => {
          await page.goto("http://localhost:5173/movies/111");

          const title = page.getByText("Scarface");
          await expect(title).toBeVisible();
        });

        test("movie can be added to watch list", async ({ page }) => {
          const watchButton = page.getByRole("button", { name: "Watch" });
          const unwatchButton = page.getByRole("button", { name: "Unwatch" });

          await expect(unwatchButton).not.toBeVisible();

          await watchButton.click();

          await expect(unwatchButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Watch List")).toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).toBeVisible();
        });

        test("movie can be removed from watch list", async ({ page }) => {
          const watchButton = page.getByRole("button", { name: "Watch" });

          await watchButton.click();

          const unwatchButton = page.getByRole("button", { name: "Unwatch" });
          await expect(unwatchButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          await unwatchButton.click();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Watch List")).not.toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).not.toBeVisible();
        });

        test("movie can be added to favorite list", async ({ page }) => {
          const favoriteButton = page.getByRole("button", { name: "Favorite" });
          const unfavoriteButton = page.getByRole("button", {
            name: "Unfavorite",
          });

          await expect(unfavoriteButton).not.toBeVisible();

          await favoriteButton.click();

          await expect(unfavoriteButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Favorite movies")).toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).toBeVisible();
        });

        test("movie can be removed from favorite list", async ({ page }) => {
          const favoriteButton = page.getByRole("button", { name: "Favorite" });

          await favoriteButton.click();

          const unfavoriteButton = page.getByRole("button", {
            name: "Unfavorite",
          });
          await expect(unfavoriteButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await unfavoriteButton.click();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Favorite movies")).not.toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).not.toBeVisible();
        });

        test("movie can be added to seen list", async ({ page }) => {
          const seenButton = page.getByRole("button", { name: "Seen" });
          const unseeButton = page.getByRole("button", {
            name: "Unsee",
          });

          await expect(unseeButton).not.toBeVisible();

          await seenButton.click();

          await expect(unseeButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Already seen")).toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).toBeVisible();
        });

        test("movie can be removed from seen list", async ({ page }) => {
          const seenButton = page.getByRole("button", { name: "Seen" });

          await seenButton.click();

          const unseeButton = page.getByRole("button", {
            name: "Unsee",
          });
          await expect(unseeButton).toBeVisible();

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await unseeButton.click();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Already seen")).not.toBeVisible();
          await expect(
            page.getByRole("link", { name: "Scarface poster" })
          ).not.toBeVisible();
        });

        test("movie can be added to multiple lists", async ({ page }) => {
          const seenButton = page.getByRole("button", { name: "Seen" });
          const favoriteButton = page.getByRole("button", { name: "Favorite" });
          const watchButton = page.getByRole("button", { name: "Watch" });

          await seenButton.click();
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await favoriteButton.click();
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await watchButton.click();
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Watch List")).toBeVisible();
          await expect(page.getByText("Favorite Movies")).toBeVisible();
          await expect(page.getByText("Already seen")).toBeVisible();

          const movies = await page
            .getByRole("link", { name: "Scarface poster" })
            .all();
          expect(movies).toHaveLength(3);
        });

        test("movie can be removed from multiple lists", async ({ page }) => {
          const seenButton = page.getByRole("button", { name: "Seen" });
          const favoriteButton = page.getByRole("button", { name: "Favorite" });
          const watchButton = page.getByRole("button", { name: "Watch" });

          await seenButton.click();
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await favoriteButton.click();
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await watchButton.click();
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          const unseeButton = page.getByRole("button", {
            name: "Unsee",
          });
          const unfavoriteButton = page.getByRole("button", {
            name: "Unfavorite",
          });
          const unwatchButton = page.getByRole("button", { name: "Unwatch" });

          await expect(unwatchButton).toBeVisible();
          await expect(unseeButton).toBeVisible();
          await expect(unfavoriteButton).toBeVisible();

          await unseeButton.click();

          await unfavoriteButton.click();

          await unwatchButton.click();
          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Watch List")).not.toBeVisible();
          await expect(page.getByText("Favorite Movies")).not.toBeVisible();
          await expect(page.getByText("Already seen")).not.toBeVisible();

          const movies = await page
            .getByRole("link", { name: "Scarface poster" })
            .all();
          expect(movies).toHaveLength(0);
        });
      });

      describe("dealing with comments to a movie page", () => {
        beforeEach(async ({ page }) => {
          await page.goto("http://localhost:5173/movies/111");

          const title = page.getByText("Scarface");
          await expect(title).toBeVisible();
        });

        test("a user can add comments to a movie", async ({ page }) => {
          await expect(page.getByText("no comments yet...")).toBeVisible();

          await postComment(page, "I love this movie");

          await expect(
            page.getByText("Comment 'I love this movie' successfully added")
          ).toBeVisible();

          await expect(
            page.getByRole("link", { name: "Mr Tester I love this movie" })
          ).toBeVisible();

          await expect(page.getByText("no comments yet...")).not.toBeVisible();
        });

        describe("and a comment was added to a movie", () => {
          beforeEach(async ({ page }) => {
            await postComment(page, "I love this movie");

            await expect(
              page.getByText("Comment 'I love this movie' successfully added")
            ).toBeVisible();
          });

          test("comment author can edit their comment", async ({ page }) => {
            const editCommentButton = page.getByRole("button", {
              name: "edit comment",
            });
            await editCommentButton.click();

            const editCommentInput = page
              .locator("ul")
              .filter({ hasText: "Mr TesterI love this" })
              .getByPlaceholder("comment");

            const submitEditButton = page
              .locator("ul")
              .filter({ hasText: "MMr TesterI love this" })
              .locator("#comment-button");

            await editCommentInput.fill("Al Pacino rocks");
            await submitEditButton.click();

            await expect(page.getByText("Al Pacino rocks")).toBeVisible();
            await expect(
              page.getByText("Comment successfully updated")
            ).toBeVisible();
          });

          test("comment author can delete their comment", async ({ page }) => {
            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible();
            await expect(page.getByText("I love this movie")).not.toBeVisible();
            await expect(page.getByText("no comments yet...")).toBeVisible();
          });
        });
      });
    });

    describe("and there is one more registered user", () => {
      beforeEach(async ({ page }) => {
        await expect(
          page.getByText("Sign up was successful, please log in")
        ).toBeVisible();

        await registerWith(
          page,
          "toster",
          "Ms Toster",
          "toster@example.com",
          "secret",
          "secret"
        );
      });

      test("and another user can log in", async ({ page }) => {
        await loginWith(page, "toster", "secret");

        await expect(page.getByText("Successfully logged in")).toBeVisible();
      });

      describe("and another user has logged in", () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, "toster", "secret");

          await expect(page.getByText("Successfully logged in")).toBeVisible();
        });

        test("another user is visible in user list", async ({ page }) => {
          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Ms Toster" });
          await expect(userPageLink).toBeVisible();
        });

        test("a user can leave a comment on another user profile", async ({
          page,
        }) => {
          const usersLink = page.getByRole("link", { name: "Users" });
          await usersLink.click();

          const userPageLink = page.getByRole("link", { name: "Mr Tester" });
          await userPageLink.click();

          await expect(page.getByText("Mr Tester")).toBeVisible();

          const openCommentButton = page.getByRole("button", {
            name: "leave a comment",
          });
          await openCommentButton.click();

          //   const submitCommentButton = page.getByRole("button", {
          //     name: "Submit comment",
          //   });

          //   const commentInput = page.getByPlaceholder("comment");
          //   await commentInput.fill("Another user was here");

          //   await submitCommentButton.click();
          await postComment(page, "Another user was here");

          await expect(
            page.getByText(
              "Comment 'Another user was here' successfully created"
            )
          ).toBeVisible();

          await expect(
            page.getByRole("link", {
              name: "Ms Toster Another user was here",
            })
          ).toBeVisible();

          const editCommentButton = page.getByRole("button", {
            name: "edit comment",
          });
          await expect(editCommentButton).toBeVisible();

          const deleteCommentButton = page.getByRole("button", {
            name: "Delete comment",
          });
          await expect(deleteCommentButton).toBeVisible();
        });

        describe("a second user created a comment in their own profile and another user profile, logged in with another user", () => {
          beforeEach(async ({ page }) => {
            // comment on first user profile
            const usersLink = page.getByRole("link", { name: "Users" });
            await usersLink.click();

            const userPageLink = page.getByRole("link", { name: "Mr Tester" });
            await userPageLink.click();

            await expect(page.getByText("Mr Tester")).toBeVisible();

            const openCommentButton = page.getByRole("button", {
              name: "leave a comment",
            });
            await openCommentButton.click();

            // const submitCommentButton = page.getByRole("button", {
            //   name: "Submit comment",
            // });

            // const commentInput = page.getByPlaceholder("comment");
            // await commentInput.fill("Another user was here");

            // await submitCommentButton.click();
            await postComment(page, "Another user was here");

            await expect(
              page.getByText(
                "Comment 'Another user was here' successfully created"
              )
            ).toBeVisible();

            // going to current users profile and leaving a comment there
            await usersLink.click();

            const commentAuthorPage = page.getByRole("link", {
              name: "Ms Toster",
            });
            await expect(page.getByText("Ms Toster")).toBeVisible();
            await commentAuthorPage.click();

            await openCommentButton.click();
            // await commentInput.fill("This is my own profile");

            // await submitCommentButton.click();
            await postComment(page, "This is my own profile");

            await expect(
              page.getByText(
                "Comment 'This is my own profile' successfully created"
              )
            ).toBeVisible();

            // logging out
            const logoutButton = page.getByText("log out");
            await logoutButton.click();

            // logging in to another profile
            await loginWith(page, "tester", "secret");

            await expect(
              page.getByText("Successfully logged in")
            ).toBeVisible();

            await page.getByText("Users").click();
          });

          test("a user can not edit a comment on another user profile", async ({
            page,
          }) => {
            const commentAuthorPage = page.getByRole("link", {
              name: "Ms Toster",
            });
            await expect(page.getByText("Ms Toster")).toBeVisible();
            await commentAuthorPage.click();

            await expect(
              page.getByRole("link", { name: "Ms Toster This is my own" })
            ).toBeVisible();

            const editCommentButton = page.getByRole("button", {
              name: "edit comment",
            });
            await expect(editCommentButton).not.toBeVisible();
          });

          test("a user can not delete a comment on another user profile", async ({
            page,
          }) => {
            const commentAuthorPage = page.getByRole("link", {
              name: "Ms Toster",
            });
            await expect(page.getByText("Ms Toster")).toBeVisible();
            await commentAuthorPage.click();

            await expect(
              page.getByRole("link", { name: "Ms Toster This is my own" })
            ).toBeVisible();

            const deleteCommentButton = page.getByRole("button", {
              name: "Delete comment",
            });
            await expect(deleteCommentButton).not.toBeVisible();
          });

          test("a user can not edit a comment on their profile if they are not the comments author", async ({
            page,
          }) => {
            const ownPage = page.getByRole("link", {
              name: "Mr Tester",
            });
            await expect(page.getByText("Mr Tester")).toBeVisible();
            await ownPage.click();

            await expect(page.getByText("Another user was here")).toBeVisible();

            const editCommentButton = page.getByRole("button", {
              name: "edit comment",
            });
            await expect(editCommentButton).not.toBeVisible();
          });

          test("a user can delete a comment on their profile even if they are not the author", async ({
            page,
          }) => {
            const ownPage = page.getByRole("link", {
              name: "Mr Tester",
            });
            await expect(page.getByText("Mr Tester")).toBeVisible();
            await ownPage.click();

            await expect(page.getByText("Another user was here")).toBeVisible();

            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible();
            await expect(
              page.getByText("Another user was here")
            ).not.toBeVisible();
          });
        });
      });
    });
  });

  describe("Searching for movies", () => {
    test("search bar is not immediately in the viewport", async ({ page }) => {
      const searchForm = page.getByText(
        "Select genresdirectoryearRating rangeType in actor and press entercountry"
      );
      await expect(searchForm).not.toBeInViewport();

      const searchCTAButton = page.getByRole("button", {
        name: "search",
        exact: true,
      });

      await searchCTAButton.click();

      await expect(searchForm).toBeInViewport();

      const newSearchButton = page.getByRole("button", { name: "new search" });

      await expect(newSearchButton).toBeInViewport();
    });

    test("search bar is moved into viewport by pressing 'search' cta", async ({
      page,
    }) => {
      const searchForm = page.getByText(
        "Select genresdirectoryearRating rangeType in actor and press entercountry"
      );

      const searchCTAButton = page.getByRole("button", {
        name: "search",
        exact: true,
      });

      await searchCTAButton.click();

      await expect(searchForm).toBeInViewport();

      const newSearchButton = page.getByRole("button", { name: "new search" });

      await expect(newSearchButton).toBeInViewport();
    });

    describe("search bar is in viewport", () => {
      beforeEach(async ({ page }) => {
        const searchCTAButton = page.getByRole("button", {
          name: "search",
          exact: true,
        });

        await searchCTAButton.click();
      });

      test("empty search returns movie cards", async ({ page }) => {
        const searchMoviesButton = page.getByLabel("Search for movies");
        await searchMoviesButton.click();

        const ten = page.getByText("10");
        await expect(ten).toBeVisible();

        const cards = await page.getByTestId("search-movie-card").all();
        expect(cards).toHaveLength(20);

        await expect(cards[0]).toBeVisible();

        const lastMovieCard = page.getByTestId("search-movie-card").nth(19);
        await expect(lastMovieCard).toBeVisible();
      });

      describe("and an empty search was done", () => {
        beforeEach(async ({ page }) => {
          const searchMoviesButton = page.getByLabel("Search for movies");
          await searchMoviesButton.click();
        });

        test("empty search returns 10 pages with pagination", async ({
          page,
        }) => {
          const pageOne = page.getByLabel("page 1", { exact: true });
          await expect(pageOne).toBeVisible();

          const pageTen = page.getByLabel("Go to page 10");
          await expect(pageTen).toBeVisible();
        });

        test("movie cards do not have buttons when user is not logged in", async ({
          page,
        }) => {
          const watchButton = page.getByRole("button", { name: "Watch" });
          await expect(watchButton).not.toBeVisible();

          const favoriteButton = page.getByRole("button", { name: "Favorite" });
          await expect(favoriteButton).not.toBeVisible();

          const seenButton = page.getByRole("button", { name: "Seen" });
          await expect(seenButton).not.toBeVisible();
        });
      });

      test("search fields can be filled and a search with them can be made", async ({
        page,
      }) => {
        const genresSelector = page
          .locator("div")
          .filter({ hasText: /^Select genres$/ })
          .nth(2);

        await genresSelector.click();

        const crimeGenre = page.getByText("Crime");
        await crimeGenre.click();
        // await expect(page.getByText("Crime")).toBeVisible();

        const directorInput = page.getByPlaceholder("director");
        await directorInput.fill("Scorsese");

        const yearInput = page.getByPlaceholder("year");
        await yearInput.fill("1995");

        const lowerRatingInput = page.getByPlaceholder("Lower threshold");
        await lowerRatingInput.fill("7");

        const higherRatingInput = page.getByPlaceholder("Upper threshold");
        await higherRatingInput.fill("9");

        const countryInput = page.getByPlaceholder("country");
        await countryInput.fill("United States of America");

        const searchMoviesButton = page.getByLabel("Search for movies");
        await searchMoviesButton.click();

        await expect(page.getByText("Casino")).toBeVisible();
        await expect(page.getByAltText("Casino poster")).toBeVisible();
      });

      describe("and a movie 'Casino' was found", () => {
        beforeEach(async ({ page }) => {
          const genresSelector = page
            .locator("div")
            .filter({ hasText: /^Select genres$/ })
            .nth(2);

          await genresSelector.click();

          const crimeGenre = page.getByText("Crime");
          await crimeGenre.click();

          const directorInput = page.getByPlaceholder("director");
          await directorInput.fill("Scorsese");

          const yearInput = page.getByPlaceholder("year");
          await yearInput.fill("1995");

          const lowerRatingInput = page.getByPlaceholder("Lower threshold");
          await lowerRatingInput.fill("7");

          const higherRatingInput = page.getByPlaceholder("Upper threshold");
          await higherRatingInput.fill("9");

          const countryInput = page.getByPlaceholder("country");
          await countryInput.fill("United States of America");

          const searchMoviesButton = page.getByLabel("Search for movies");
          await searchMoviesButton.click();

          await expect(page.getByText("Casino")).toBeVisible();
        });

        test("a movie card can be clicked, which takes user to movie profile", async ({
          page,
        }) => {
          await page.getByText("Casino").click();

          await expect(
            page.getByRole("heading", { name: "Casino" })
          ).toBeVisible();
          await expect(
            page.getByText("No one stays at the top forever.")
          ).toBeVisible();
        });

        test("new search button clears search results and resets the form", async ({
          page,
        }) => {
          const newSearchButton = page.getByRole("button", {
            name: "new search",
          });
          await newSearchButton.click();

          await expect(page.getByText("Casino")).not.toBeVisible();
          await expect(page.getByText("1")).not.toBeVisible();
        });
      });
    });
  });
});
