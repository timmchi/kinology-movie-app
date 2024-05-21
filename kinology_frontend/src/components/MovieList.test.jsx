import MovieList from "./MovieList";
import myFavoriteMovies from "../data/myFavoriteMovies";
import { expect, test } from "vitest";
import { testSetup } from "../utils/testUtils";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

test("renders properly when there are no movies", () => {
  render(<MovieList />);

  const text = screen.getByText("no movies yet");
  expect(text).toBeDefined();
});

test("renders properly with a list of movies", () => {
  render(
    <MemoryRouter>
      <MovieList movies={myFavoriteMovies.slice(0, 3)} />
    </MemoryRouter>
  );

  const movie1 = screen.getByText(myFavoriteMovies[0].title);
  const movie2 = screen.getByText(myFavoriteMovies[1].title);
  const movie3 = screen.getByText(myFavoriteMovies[2].title);

  expect(movie1).toBeDefined();
  expect(movie2).toBeDefined();
  expect(movie3).toBeDefined();

  const movie1Img = screen.getByAltText(`${myFavoriteMovies[0].title} poster`);
  const movie2Img = screen.getByAltText(`${myFavoriteMovies[1].title} poster`);
  const movie3Img = screen.getByAltText(`${myFavoriteMovies[2].title} poster`);

  expect(movie1Img).toBeDefined();
  expect(movie2Img).toBeDefined();
  expect(movie3Img).toBeDefined();
});
