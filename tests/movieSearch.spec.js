const { test, describe, expect, beforeEach } = require("playwright/test");
const {
  movieButtonsNotVisible,
  clickButton,
  linkIsVisible,
  textIsVisible,
} = require("./helper");

describe("Searching for movies", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    await page.goto("/");
  });

  test("search button is not immediately in the viewport", async ({ page }) => {
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

    test("search by title bar can be filled and will return a movie", async ({
      page,
    }) => {
      await page.getByLabel("Search by title").click();

      await page
        .getByLabel("Search by title")
        .fill("killers of the flower moon");

      await page.locator("#search-function").getByRole("button").nth(1).click();

      await linkIsVisible(page, "Killers of the Flower Moon");
    });

    test("search by title bar can be reset", async ({ page }) => {
      await page.getByLabel("Search by title").click();

      await page
        .getByLabel("Search by title")
        .fill("killers of the flower moon");

      await page.locator("#search-function").getByRole("button").nth(1).click();

      await linkIsVisible(page, "Killers of the Flower Moon");

      await page
        .locator("#search-function")
        .getByRole("button")
        .first()
        .click();

      await expect(
        page.getByRole("link", { name: "Killers of the Flower Moon" })
      ).not.toBeVisible();

      await expect(
        page.getByText("killers of the flower moon")
      ).not.toBeVisible();
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

        await textIsVisible(page, "Casino");
      });

      test("a movie card can be clicked, which takes user to movie profile", async ({
        page,
      }) => {
        await page.getByRole("link", { name: "Casino Casino " }).click();

        await expect(
          page.getByRole("heading", { name: "Casino" })
        ).toBeVisible();

        await textIsVisible(page, "No one stays at the top forever.");
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
