import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import GenreList from "./GenreList";

const mockGenres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 99,
    name: "Documentary",
  },
];

test("renders genre list with correct genres", () => {
  render(<GenreList genres={mockGenres} />);

  expect(screen.getByText(mockGenres[0].name)).toBeVisible();
  expect(screen.getByText(mockGenres[1].name)).toBeVisible();
  expect(screen.getByText(mockGenres[2].name)).toBeVisible();
});
