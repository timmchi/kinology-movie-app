import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCard from "./MovieCard";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

test("renders a movie card with all buttons", () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  );

  const element = screen.getByText("Scarface");
  const favButton = screen.getByText("Favorite");
  const watchButton = screen.getByText("Watch");
  const seenButton = screen.getByText("Seen");

  expect(element).toBeDefined();
  expect(favButton).toBeDefined();
  expect(watchButton).toBeDefined();
  expect(seenButton).toBeDefined();
});

test("calls onButtonPress with correct argumens when Watch button is pressed, then unpressed", async () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  const mockPressHandler = vi.fn();
  const mockUnpressHandler = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <MovieCard
        movie={movie}
        onButtonPress={mockPressHandler}
        onButtonUnpress={mockUnpressHandler}
      />
    </MemoryRouter>
  );

  const watchButton = screen.getByText("Watch");
  await user.click(watchButton);

  const unwatchButton = screen.getByText("Unwatch");
  await user.click(unwatchButton);

  expect(mockPressHandler.mock.calls).toHaveLength(1);
  expect(mockUnpressHandler.mock.calls).toHaveLength(1);
});

test("calls onButtonPress with correct argumens when Favorite button is pressed, then unpressed", async () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  const mockPressHandler = vi.fn();
  const mockUnpressHandler = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <MovieCard
        movie={movie}
        onButtonPress={mockPressHandler}
        onButtonUnpress={mockUnpressHandler}
      />
    </MemoryRouter>
  );

  const favButton = screen.getByText("Favorite");
  await user.click(favButton);

  const unfavButton = screen.getByText("Unfavorite");
  await user.click(unfavButton);

  expect(mockPressHandler.mock.calls).toHaveLength(1);
  expect(mockUnpressHandler.mock.calls).toHaveLength(1);
});

test("calls onButtonPress with correct argumens when Seen button is pressed, then unpressed", async () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  const mockPressHandler = vi.fn();
  const mockUnpressHandler = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <MovieCard
        movie={movie}
        onButtonPress={mockPressHandler}
        onButtonUnpress={mockUnpressHandler}
      />
    </MemoryRouter>
  );

  const seenButton = screen.getByText("Seen");
  await user.click(seenButton);

  const unseeButton = screen.getByText("Remove from seen");
  await user.click(unseeButton);

  expect(mockPressHandler.mock.calls).toHaveLength(1);
  expect(mockUnpressHandler.mock.calls).toHaveLength(1);
});
