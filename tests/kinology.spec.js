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
    await request.post("http:localhost:3001/api/testing/reset");

    await page.goto("http://localhost:5173");
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
    ).toBeVisible();
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

        await expect(page.getByText("Successfully logged in")).toBeVisible();
      });

      test("can log out", async ({ page }) => {
        await expect(page.getByText("Successfully logged in")).toBeVisible();

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
        await page.goto("http://localhost:5173/movies/111");

        const title = page.getByText("Scarface");
        await expect(title).toBeVisible();

        await movieButtonsVisible(page);
      });

      describe("and a search for movie Casino done", () => {
        beforeEach(async ({ page }) => {
          await clickButton(page, "search");

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

          const commentInput = page.getByPlaceholder("comment");
          const commentInputText = page.getByText("Your comment");

          await expect(commentInput).toBeVisible();
          await expect(commentInputText).toBeVisible();

          await buttonIsVisible(page, "Submit comment");
          await buttonIsVisible(page, "cancel");
        });

        test("comment form can be closed", async ({ page }) => {
          await openCommentForm(page);

          const commentInput = page.getByPlaceholder("comment");
          const commentInputText = page.getByText("Your comment");

          await clickButton(page, "cancel");

          await buttonIsVisible(page, "Submit comment", true);
          await buttonIsVisible(page, "cancel", true);

          await expect(commentInput).not.toBeVisible();
          await expect(commentInputText).not.toBeVisible();
        });

        test("user can leave a comment on his profile", async ({ page }) => {
          await openCommentForm(page);

          await postComment(page, "my comment");

          await expect(
            page.getByText("Comment 'my comment' successfully created")
          ).toBeVisible();

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
            ).toBeVisible();
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
            ).toBeVisible();

            await linkIsVisible(page, "Mr Tester it has been edited");
          });

          test("a comment can be deleted by its author", async ({ page }) => {
            await deleteComment(page);

            await expect(
              page.getByText("Comment successfully deleted")
            ).toBeVisible();

            await linkIsVisible(page, "Mr tester my comment", true);
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
          // starts off not visible, not = true
          await buttonIsVisible(page, "Unwatch", true);

          await clickButton(page, "Watch");

          await buttonIsVisible(page, "Unwatch");

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Watch List")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from watch list", async ({ page }) => {
          await clickButton(page, "Watch");

          await buttonIsVisible(page, "Unwatch");

          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          await clickButton(page, "Unwatch");

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Watch List")).not.toBeVisible();

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to favorite list", async ({ page }) => {
          await buttonIsVisible(page, "Unfavorite", true);

          await clickButton(page, "Favorite");

          await buttonIsVisible(page, "Unfavorite");

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Favorite movies")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from favorite list", async ({ page }) => {
          await clickButton(page, "Favorite");

          await buttonIsVisible(page, "Unfavorite");

          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await clickButton(page, "Unfavorite");

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Favorite movies")).not.toBeVisible();

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to seen list", async ({ page }) => {
          await buttonIsVisible(page, "Unsee", true);

          await clickButton(page, "Seen");

          await buttonIsVisible(page, "Unsee");

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await visitUserPage(page, "Mr Tester");

          await expect(page.getByText("Already seen")).toBeVisible();

          await linkIsVisible(page, "Scarface poster");
        });

        test("movie can be removed from seen list", async ({ page }) => {
          await clickButton(page, "Seen");

          await buttonIsVisible(page, "Unsee");

          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await clickButton(page, "Unsee");

          await visitUserPage(page, "Mr Tester");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

          await expect(page.getByText("Mr Tester")).toBeVisible();
          await expect(page.getByText("Already seen")).not.toBeVisible();

          await linkIsVisible(page, "Scarface poster", true);
        });

        test("movie can be added to multiple lists", async ({ page }) => {
          await clickButton(page, "Seen");
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await clickButton(page, "Favorite");
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await clickButton(page, "Watch");
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

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
          await expect(
            page.getByText("Successfully added Scarface to watched")
          ).toBeVisible();

          await clickButton(page, "Favorite");
          await expect(
            page.getByText("Successfully added Scarface to favorite")
          ).toBeVisible();

          await clickButton(page, "Watch");
          await expect(
            page.getByText("Successfully added Scarface to later")
          ).toBeVisible();

          await buttonIsVisible(page, "Unsee");
          await buttonIsVisible(page, "Unwatch");
          await buttonIsVisible(page, "Unfavorite");

          await clickButton(page, "Unsee");
          await clickButton(page, "Unwatch");
          await clickButton(page, "Unfavorite");

          await expect(
            page.getByText("Successfully removed movie from your profile")
          ).toBeVisible();

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

          await linkIsVisible(page, "Mr Tester I love this movie");

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
            await clickButton(page, "edit comment");

            const editCommentInput = page
              .locator("ul")
              .filter({ hasText: "MMr TesterI love this" })
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
          ).toBeVisible();

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
            ).toBeVisible();

            // going to current users profile and leaving a comment there
            await visitUserPage(page, "Ms Toster");

            // await openCommentButton.click();
            await openCommentForm(page);

            await postComment(page, "This is my own profile");

            await expect(
              page.getByText(
                "Comment 'This is my own profile' successfully created"
              )
            ).toBeVisible();

            // logging out
            await logOut(page);

            // logging in to another profile
            await loginWith(page, "tester", "secret");

            await expect(
              page.getByText("Successfully logged in")
            ).toBeVisible();
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

      await clickButton(page, "search");

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

      await clickButton(page, "search");

      await expect(searchForm).toBeInViewport();

      const newSearchButton = page.getByRole("button", { name: "new search" });

      await expect(newSearchButton).toBeInViewport();
    });

    describe("search bar is in viewport", () => {
      beforeEach(async ({ page }) => {
        await clickButton(page, "search");
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
          await movieButtonsNotVisible(page);
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
          await clickButton(page, "new search");

          await expect(page.getByText("Casino")).not.toBeVisible();
          await expect(page.getByText("1")).not.toBeVisible();
        });
      });
    });
  });
});
