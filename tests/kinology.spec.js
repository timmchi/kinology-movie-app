const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  movieButtonsVisible,
  movieButtonsNotVisible,
  logOut,
  visitUserPage,
  heroPageVisible,
  openCommentForm,
  clickButton,
  clickLink,
  linkIsVisible,
  buttonIsVisible,
} = require("./helper");

describe("Kinology", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
  });

  test("front page can be opened", async ({ page }) => {
    await heroPageVisible(page);
  });

  test("nav bar is visible on the front page", async ({ page }) => {
    await linkIsVisible(page, "Kinology");
    await linkIsVisible(page, "About");
    await linkIsVisible(page, "Log In");
    await linkIsVisible(page, "Sign Up");
  });

  test("registration form can be opened through CTA", async ({ page }) => {
    await clickButton(page, "Register");

    const registrationFormFields = page.getByText(
      "UsernameNameEmailPasswordConfirm PasswordSign Up"
    );

    await buttonIsVisible(page, "Sign Up");

    await expect(registrationFormFields).toBeVisible();
  });

  test("registration form can be opened through navbar", async ({ page }) => {
    await clickLink(page, "Sign Up");

    const registrationFormFields = page.getByText(
      "UsernameNameEmailPasswordConfirm PasswordSign Up"
    );

    await buttonIsVisible(page, "Sign Up");
    await expect(registrationFormFields).toBeVisible();
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
    ).toBeVisible({ timeout: 10000 });
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

  test("login form can be opened through navbar", async ({ page }) => {
    await clickLink(page, "Log In");

    await buttonIsVisible(page, "Log In");
  });

  test("about section can be opened through nav bar", async ({ page }) => {
    await clickLink(page, "About");

    await expect(page.getByText("About me")).toBeVisible();
    await expect(page.getByText("Web app uses TMDB api")).toBeVisible();
    await expect(page.getByText("Fullstack open")).toBeVisible();
  });

  describe("about page is open", () => {
    beforeEach(async ({ page }) => {
      await clickLink(page, "About");

      await expect(page.getByText("About me")).toBeVisible();
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

      test("contact form can be filled and submitted, and it closes the modal", async ({
        page,
      }) => {
        const nameInput = page.getByLabel("Name");
        const emailInput = page.getByLabel("Email");
        const messageInput = page.getByLabel("Your message");

        const submitButton = page.getByLabel("Submit message");

        await nameInput.fill("Tester");
        await emailInput.fill("tester@example.com");
        await messageInput.fill("I am testing this sites functionality");

        await submitButton.click();

        await page.waitForTimeout(3000);

        await expect(nameInput).not.toBeVisible({ timeout: 10000 });
        await expect(emailInput).not.toBeVisible({ timeout: 10000 });
        await expect(messageInput).not.toBeVisible({ timeout: 10000 });
        await expect(submitButton).not.toBeVisible({ timeout: 10000 });
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

        await expect(
          page.getByText("Name or nickname should be 3 or more symbols")
        ).toBeVisible();
        await expect(
          page.getByText("The email address is badly formatted")
        ).toBeVisible();
        await expect(
          page.getByText("Message should be 3 or more symbols")
        ).toBeVisible();
      });
    });
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
      ).toBeVisible({ timeout: 10000 });

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

      await expect(page.getByText("Successfully logged in")).toBeVisible({
        timeout: 10000,
      });

      await heroPageVisible(page);
    });

    test("failed log in attempt", async ({ page }) => {
      await loginWith(page, "tester", "toster");

      await expect(
        page.getByText("Something went wrong when logging in")
      ).toBeVisible();

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

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "tester", "secret");

        await expect(page.getByText("Successfully logged in")).toBeVisible({
          timeout: 10000,
        });
      });

      test("can log out", async ({ page }) => {
        await expect(page.getByText("Successfully logged in")).toBeVisible({
          timeout: 10000,
        });

        await logOut(page);

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

        await expect(page.getByText("Mr Tester")).toBeVisible();

        await buttonIsVisible(page, "Update Profile");

        await buttonIsVisible(page, "Delete User");
      });

      test("user can access a single movie page and movie buttons will be shown", async ({
        page,
      }) => {
        await page.goto("/movies/111");

        const title = page.getByText("Scarface");
        await expect(title).toBeVisible();

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

          await expect(page.getByText("Casino")).toBeVisible();
        });

        test("movie buttons on a movie card are visible to a logged in user", async ({
          page,
        }) => {
          await movieButtonsVisible(page);
        });
      });

      describe("dealing with comments to a user page", () => {
        beforeEach(async ({ page }) => {
          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Mr Tester")).toBeVisible();
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

          await expect(
            page.getByText("Comment 'my comment' successfully created")
          ).toBeVisible({ timeout: 10000 });

          await linkIsVisible(page, "Mr Tester my comment");

          await buttonIsVisible(page, "edit comment");
          await buttonIsVisible(page, "Delete comment");
        });

        describe("and user profile has a comment left by profile owner", () => {
          beforeEach(async ({ page }) => {
            await openCommentForm(page);

            await postComment(page, "my comment");

            await expect(
              page.getByText("Comment 'my comment' successfully created")
            ).toBeVisible({ timeout: 10000 });
          });

          test("a comment can be edited by its author", async ({ page }) => {
            await clickButton(page, "edit comment");

            const commentInput = page.getByRole("textbox", { name: "comment" });
            await commentInput.fill("it has been edited");

            await clickButton(page, "Submit comment");

            await expect(
              page.getByText(
                "Comment successfully updated with 'it has been edited'"
              )
            ).toBeVisible({ timeout: 10000 });

            await linkIsVisible(page, "Mr Tester it has been edited");
          });

          test("a comment can be deleted by its author", async ({ page }) => {
            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible({ timeout: 10000 });

            await linkIsVisible(page, "Mr tester my comment", true);
          });
        });
      });

      describe("adding a movie to user page", () => {
        beforeEach(async ({ page }) => {
          await page.goto("/movies/111");

          const title = page.getByText("Scarface");
          await expect(title).toBeVisible();
        });

        test("movie can be added to watch list", async ({ page }) => {
          // starts off not visible, not = true
          await buttonIsVisible(page, "Unwatch", true);

          await clickButton(page, "Watch");

          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unwatch");

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible({ timeout: 10000 });

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Watch List")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from watch list", async ({ page }) => {
          await clickButton(page, "Watch");

          await buttonIsVisible(page, "Unwatch");

          await page.waitForTimeout(1000);

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Unwatch");

          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible({ timeout: 10000 });

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Watch List")).not.toBeVisible({
            timeout: 10000,
          });

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to favorite list", async ({ page }) => {
          await buttonIsVisible(page, "Unfavorite", true);

          await clickButton(page, "Favorite");

          await buttonIsVisible(page, "Unfavorite");

          await page.waitForTimeout(1000);

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible({ timeout: 10000 });

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Favorite movies")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from favorite list", async ({ page }) => {
          await clickButton(page, "Favorite");

          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unfavorite");

          await page.waitForTimeout(1000);

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Unfavorite");

          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible({ timeout: 10000 });

          await expect(page.getByText("Mr Tester")).toBeVisible();
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

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible({ timeout: 10000 });

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Already seen")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from seen list", async ({ page }) => {
          await clickButton(page, "Seen");

          await page.waitForTimeout(1000);

          await buttonIsVisible(page, "Unsee");

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Unsee");

          await page.waitForTimeout(1000);

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible({ timeout: 10000 });

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Already seen")).not.toBeVisible({
            timeout: 10000,
          });

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to multiple lists", async ({ page }) => {
          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Favorite");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Watch");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible({ timeout: 10000 });

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Watch List")).toBeVisible();
          await expect(page.getByText("Favorite Movies")).toBeVisible();
          await expect(page.getByText("Already seen")).toBeVisible();

          const movies = await page
            .getByRole("link", { name: "Scarface poster" })
            .all();
          expect(movies).toHaveLength(3);
        });

        test("movie can be removed from multiple lists", async ({ page }) => {
          await clickButton(page, "Seen");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Favorite");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible({ timeout: 10000 });

          await clickButton(page, "Watch");
          await page.waitForTimeout(1000);
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible({ timeout: 10000 });

          await buttonIsVisible(page, "Unsee");
          await buttonIsVisible(page, "Unwatch");
          await buttonIsVisible(page, "Unfavorite");

          await clickButton(page, "Unsee");
          await clickButton(page, "Unwatch");
          await clickButton(page, "Unfavorite");

          //   await expect(
          //     page.getByText("Successfully removed movie from your profile")
          //   ).toBeVisible();

          await visitUserPage(page, "Mr Tester");

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
          await page.goto("/movies/111");

          const title = page.getByText("Scarface");
          await expect(title).toBeVisible();
        });

        test("a user can add comments to a movie", async ({ page }) => {
          await expect(page.getByText("no comments yet...")).toBeVisible();

          await postComment(page, "I love this movie");

          await expect(
            page.getByText("Comment 'I love this movie' successfully added")
          ).toBeVisible({ timeout: 10000 });

          await linkIsVisible(page, "Mr Tester I love this movie");

          await expect(page.getByText("no comments yet...")).not.toBeVisible();
        });

        describe("and a comment was added to a movie", () => {
          beforeEach(async ({ page }) => {
            await postComment(page, "I love this movie");

            await expect(
              page.getByText("Comment 'I love this movie' successfully added")
            ).toBeVisible({ timeout: 10000 });
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

            await expect(page.getByText("Al Pacino rocks")).toBeVisible();
            await expect(
              page.getByText("Comment successfully updated")
            ).toBeVisible({ timeout: 10000 });
          });

          test("comment author can delete their comment", async ({ page }) => {
            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible({ timeout: 10000 });
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
        ).toBeVisible({ timeout: 10000 });

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

        await expect(page.getByText("Successfully logged in")).toBeVisible({
          timeout: 10000,
        });
      });

      describe("and another user has logged in", () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, "toster", "secret");

          await expect(page.getByText("Successfully logged in")).toBeVisible({
            timeout: 10000,
          });
        });

        test("another user is visible in user list", async ({ page }) => {
          await clickLink(page, "Users");

          await linkIsVisible(page, "Ms Toster");
        });

        test("a user can leave a comment on another user profile", async ({
          page,
        }) => {
          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Mr Tester")).toBeVisible();

          await openCommentForm(page);

          await postComment(page, "Another user was here");

          await expect(
            page.getByText(
              "Comment 'Another user was here' successfully created"
            )
          ).toBeVisible({ timeout: 10000 });

          await linkIsVisible(page, "Ms Toster Another user was here");

          await buttonIsVisible(page, "edit comment");

          await buttonIsVisible(page, "Delete comment");
        });

        describe("a second user created a comment in their own profile and another user profile, logged in with another user", () => {
          beforeEach(async ({ page }) => {
            // comment on first user profile
            await visitUserPage(page, "Mr Tester");

            await expect(page.getByText("Mr Tester")).toBeVisible();

            await openCommentForm(page);

            await postComment(page, "Another user was here");

            await expect(
              page.getByText(
                "Comment 'Another user was here' successfully created"
              )
            ).toBeVisible({ timeout: 10000 });

            // going to current users profile and leaving a comment there
            await visitUserPage(page, "Ms Toster");

            await openCommentForm(page);

            await postComment(page, "This is my own profile");

            await page.waitForTimeout(1000);

            await expect(
              page.getByText(
                "Comment 'This is my own profile' successfully created"
              )
            ).toBeVisible({ timeout: 10000 });

            // logging out
            await logOut(page);

            // logging in to another profile
            await loginWith(page, "tester", "secret");

            await expect(page.getByText("Successfully logged in")).toBeVisible({
              timeout: 10000,
            });
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

            await expect(page.getByText("Another user was here")).toBeVisible();

            await buttonIsVisible(page, "edit comment", true);
          });

          test("a user can delete a comment on their profile even if they are not the author", async ({
            page,
          }) => {
            await visitUserPage(page, "Mr Tester");

            await expect(page.getByText("Another user was here")).toBeVisible();

            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible({ timeout: 10000 });
            await expect(
              page.getByText("Another user was here")
            ).not.toBeVisible();
          });
        });
      });
    });
  });

  describe("Searching for movies", () => {
    test("search button is not immediately in the viewport", async ({
      page,
    }) => {
      const searchButton = page.getByRole("button", { name: "Open Search" });

      await expect(searchButton).not.toBeInViewport();

      await clickButton(page, "Search");

      await expect(searchButton).toBeInViewport();

      const clearSearchButton = page.getByRole("button", {
        name: "clear search",
      });

      await expect(clearSearchButton).toBeInViewport();
    });

    test("search button is moved into viewport by pressing 'search' cta", async ({
      page,
    }) => {
      const searchButton = page.getByRole("button", { name: "Open Search" });

      await clickButton(page, "Search");

      await expect(searchButton).toBeInViewport();

      const clearSearchButton = page.getByRole("button", {
        name: "clear search",
      });

      await expect(clearSearchButton).toBeInViewport();
    });

    describe("search button is in viewport", () => {
      beforeEach(async ({ page }) => {
        await clickButton(page, "Search");
      });

      test("search modal can be opened", async ({ page }) => {
        const searchButton = page.getByRole("button", { name: "Open Search" });
        await searchButton.click();

        const genresSelector = page
          .locator("div")
          .filter({ hasText: /^Select genres$/ })
          .nth(2);

        const directorInput = page.getByLabel("Director");

        const yearInput = page.getByLabel("Year");

        const lowerRatingInput = page
          .locator("span")
          .filter({ hasText: /^0$/ })
          .first();

        const higherRatingInput = page
          .locator("span")
          .filter({ hasText: "10" })
          .first();

        const countryInput = page.getByLabel("Country");

        const searchMoviesButton = page.getByLabel("Search for movies");

        await expect(genresSelector).toBeVisible();
        await expect(directorInput).toBeVisible();
        await expect(yearInput).toBeVisible();
        await expect(lowerRatingInput).toBeVisible();
        await expect(higherRatingInput).toBeVisible();
        await expect(countryInput).toBeVisible();
        await expect(searchMoviesButton).toBeVisible();
      });

      test("empty search returns movie cards", async ({ page }) => {
        const openSearchButton = page.getByRole("button", {
          name: "Open Search",
        });
        await openSearchButton.click();

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
          const openSearchButton = page.getByRole("button", {
            name: "Open Search",
          });
          await openSearchButton.click();

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
          await movieButtonsNotVisible(page);
        });
      });

      test("search fields can be filled and a search with them can be made", async ({
        page,
      }) => {
        const openSearchButton = page.getByRole("button", {
          name: "Open Search",
        });
        await openSearchButton.click();

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

        await expect(page.getByText("Casino")).toBeVisible();
      });

      describe("and a movie 'Casino' was found", () => {
        beforeEach(async ({ page }) => {
          const openSearchButton = page.getByRole("button", {
            name: "Open Search",
          });
          await openSearchButton.click();

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
          await clickButton(page, "clear search");

          await expect(page.getByText("Casino")).not.toBeVisible();
          await expect(page.getByText("1")).not.toBeVisible();
        });
      });
    });
  });
});
