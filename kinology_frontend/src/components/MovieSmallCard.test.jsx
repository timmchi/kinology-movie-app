import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieSmallCard from "./MovieSmallCard";
import { expect, test } from "vitest";

test("renders element with the correct alt text", () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  render(
    <MemoryRouter>
      <MovieSmallCard movie={movie} />
    </MemoryRouter>
  );

  const smallCard = screen.getByAltText(`${movie.title} poster`);
  expect(smallCard).toBeDefined();
});

test("renders element with the correct alt text when image is not available", () => {
  const movie = {
    title: "Scarface",
    poster: "/incorrect.jpg",
    tmdbId: "111",
  };

  render(
    <MemoryRouter>
      <MovieSmallCard movie={movie} />
    </MemoryRouter>
  );

  const smallCard = screen.getByAltText(`${movie.title} poster`);
  expect(smallCard).toBeDefined();
});
