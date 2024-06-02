import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCard from "./MovieCard";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

test("renders a movie card with all buttons when there is a user", () => {
  const movie = {
    title: "Scarface",
    poster: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    tmdbId: "111",
  };

  render(
    <MemoryRouter>
      <MovieCard movie={movie} user={true} />
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

test("renders a movie card with no buttons when there is no user", () => {
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
  const favButton = screen.queryByText("Favorite");
  const watchButton = screen.queryByText("Watch");
  const seenButton = screen.queryByText("Seen");

  expect(element).toBeDefined();
  expect(favButton).toBeNull();
  expect(watchButton).toBeNull();
  expect(seenButton).toBeNull();
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
        user={true}
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
        user={true}
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
        user={true}
      />
    </MemoryRouter>
  );

  const seenButton = screen.getByText("Seen");
  await user.click(seenButton);

  const unseeButton = screen.getByText("Unsee");
  await user.click(unseeButton);

  expect(mockPressHandler.mock.calls).toHaveLength(1);
  expect(mockUnpressHandler.mock.calls).toHaveLength(1);
});

test("movie card has an image with correct alt text", () => {
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

  const smallCard = screen.getByAltText(`${movie.title} poster`);
  expect(smallCard).toBeDefined();
});

test("movie card has an image with correct alt text when poster path is incorrect", () => {
  const movie = {
    title: "Scarface",
    poster: "/incorrect.jpg",
    tmdbId: "111",
  };

  render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  );

  const smallCard = screen.getByAltText(`${movie.title} poster`);
  expect(smallCard).toBeDefined();
});
