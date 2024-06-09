import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieProfileList from "./MovieProfileList";
import { expect, test } from "vitest";
import myFavoriteMovies from "../../data/myFavoriteMovies";

test("renders correctly with props provided", () => {
  render(
    <MemoryRouter>
      <MovieProfileList
        header={"Test header"}
        movies={myFavoriteMovies.slice(0, 3)}
      />
    </MemoryRouter>
  );

  expect(screen.getByText("Test header")).toBeVisible();
  expect(
    screen.getByAltText(`${myFavoriteMovies[0].title} poster`)
  ).toBeVisible();
  expect(
    screen.getByAltText(`${myFavoriteMovies[1].title} poster`)
  ).toBeVisible();
  expect(
    screen.getByAltText(`${myFavoriteMovies[2].title} poster`)
  ).toBeVisible();
});

test("renders div with display none when movie list is empty", () => {
  render(
    <MemoryRouter>
      <MovieProfileList header={"Test header"} movies={[]} />
    </MemoryRouter>
  );

  const headerElement = screen.getByText("Test header");

  const movieListDiv = headerElement.closest(".movieList");

  expect(movieListDiv).toBeDefined();

  expect(movieListDiv).toHaveStyle("display: none");
});
