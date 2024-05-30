import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchForm from "./SearchForm";
import { afterEach, describe, expect, test } from "vitest";

const setMovies = vi.fn();

test("renders SearchBar properly", () => {
  render(<SearchForm setMovies={setMovies} />);

  const genres = screen.getByText("Select genres");
  const director = screen.getByPlaceholderText("director");
  const year = screen.getByPlaceholderText("year");
  const lowerRating = screen.getByPlaceholderText("Lower threshold");
  const upperRating = screen.getByPlaceholderText("Upper threshold");
  const actors = screen.getByTestId("actor-input");
  const country = screen.getByPlaceholderText("country");

  const newSearchButton = screen.getByText("new search");
  const searchButton = screen.getByRole("button", {
    name: /Search for movies/i,
  });

  expect(genres).toBeDefined();
  expect(director).toBeDefined();
  expect(year).toBeDefined();
  expect(lowerRating).toBeDefined();
  expect(upperRating).toBeDefined();
  expect(actors).toBeDefined();
  expect(country).toBeDefined();
  expect(newSearchButton).toBeDefined();
  expect(searchButton).toBeDefined();
});
