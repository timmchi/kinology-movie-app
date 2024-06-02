import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";
import About from "./About";
import myFavoriteMovies from "../../data/myFavoriteMovies";

test("renders About component properly", () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );

  expect(screen.getByText(/About me/i)).toBeDefined();
  expect(screen.getByText(/my favorite movies/i)).toBeDefined();
  expect(screen.getByText(/Web app uses TMDB api/i)).toBeDefined();
  expect(screen.getByText(/Fullstack open/i)).toBeDefined();

  const githubLink = screen.getByRole("link", { name: /Github profile/i });
  expect(githubLink).toBeDefined();
  expect(githubLink).toHaveAttribute("href", "https://github.com/timmchi");
  expect(githubLink).toHaveAttribute("target", "_blank");

  const tmdbLink = screen.getByRole("link", { name: /TMDB link/i });
  expect(tmdbLink).toBeDefined();
  expect(tmdbLink).toHaveAttribute("href", "https://www.themoviedb.org");
  expect(tmdbLink).toHaveAttribute("target", "_blank");

  const fullstackOpenLink = screen.getByRole("link", {
    name: /Fullstackopen link/i,
  });
  expect(fullstackOpenLink).toBeDefined();
  expect(fullstackOpenLink).toHaveAttribute(
    "href",
    "https://fullstackopen.com/en/"
  );
  expect(fullstackOpenLink).toHaveAttribute("target", "_blank");

  myFavoriteMovies.forEach((movie) => {
    expect(screen.getByAltText(`${movie.title} poster`)).toBeDefined();
  });
});
