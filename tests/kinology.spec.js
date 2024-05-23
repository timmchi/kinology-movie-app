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

    test("validation in log in form", async ({ page }) => {
      const loginLink = page.getByRole("link", { name: "Log In" });
      await loginLink.click();

      const usernameField = await page.getByTestId("username").fill("t");
      const passwordField = await page.getByTestId("password").fill("s");

      const loginButton = page.getByRole("button", { name: "Log In" });
      await loginButton.click();

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
        const loginLink = page.getByRole("link", { name: "Log In" });
        await loginLink.click();

        const usernameField = await page.getByTestId("username").fill("tester");
        const passwordField = await page.getByTestId("password").fill("secret");

        const loginButton = page.getByRole("button", { name: "Log In" });
        await loginButton.click();

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

      describe("adding comments to a user page", () => {
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

        test("user can leave a comment on his profile", async ({ page }) => {});
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
      });
    });
  });
});
