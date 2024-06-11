import { render, screen } from "@testing-library/react";
import SearchByTitleBar from "./SearchByTitleBar";
import { testSetup } from "../../utils/testUtils";
import { expect, test } from "vitest";

const setMovies = vi.fn();

test("renders properly", () => {
  render(<SearchByTitleBar setMovies={setMovies} />);

  screen.getByLabelText("Search by title");
  screen.getByTestId("ClearIcon");
  screen.getByTestId("SearchIcon");
});

test("Clear correctly resets value", async () => {
  const { user } = testSetup(<SearchByTitleBar setMovies={setMovies} />);

  const input = screen.getByLabelText("Search by title");
  const clearIcon = screen.getByTestId("ClearIcon");
  const searchIcon = screen.getByTestId("SearchIcon");

  await user.type(input, "Bazinga");

  expect(input).toHaveValue("Bazinga");

  await user.click(clearIcon);

  expect(input).not.toHaveValue("Bazinga");
});
