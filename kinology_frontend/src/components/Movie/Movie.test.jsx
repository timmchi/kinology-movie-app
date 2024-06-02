import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Movie from "./Movie";
import { expect, test, vi } from "vitest";
import { act } from "@testing-library/react";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import userEvent from "@testing-library/user-event";

const onButtonPress = vi.fn();
const onButtonUnpress = vi.fn();

const movieExample = {
  id: "111",
  title: "Scarface",
  slogan: "He loved the American Dream. With a vengeance.",
  overview:
    "After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.",
  genres: ["Action", "Crime", "Drama"],
  rating: "8.169",
  release: "1983-12-09",
  runtime: "169",
  image: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
};

vi.mock("../services/movies", async (importOriginal) => {
  const movieExample = {
    id: "111",
    title: "Scarface",
    slogan: "He loved the American Dream. With a vengeance.",
    overview:
      "After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.",
    genres: ["Action", "Crime", "Drama"],
    rating: "8.169",
    release: "1983-12-09",
    runtime: "169",
    image: "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
  };
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      getSingleMovie: vi.fn().mockResolvedValue(movieExample),
    },
  };
});

vi.mock("../services/comments", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      getComments: vi.fn().mockResolvedValue([]),
      createComment: vi.fn().mockResolvedValue({
        id: "1",
        content: "Great movie!",
        user: { username: "testUser", name: "Tester", id: 1 },
        movieId: "111",
      }),
      deleteComment: vi.fn().mockResolvedValue({}),
      updatComment: vi.fn().mockResolvedValue({
        id: "1",
        content: "Updated comment",
        user: { username: "testUser" },
        movieId: "111",
      }),
    },
  };
});

test("Movie component is rendered properly", async () => {
  await act(async () =>
    render(
      <MemoryRouter initialEntries={[`/movies/111`]}>
        <NotificationContextProvider>
          <Routes>
            <Route
              path="/movies/:id"
              element={
                <Movie
                  user={{ username: "testUser" }}
                  onButtonPress={onButtonPress}
                  onButtonUnpress={onButtonUnpress}
                />
              }
            />
          </Routes>
        </NotificationContextProvider>
      </MemoryRouter>
    )
  );

  const commentsHeader = screen.getByText("Comments");
  const comments = screen.getByText("no comments yet...");

  const watchButton = screen.getByText("Watch");
  const favoriteButton = screen.getByText("Favorite");
  const seenButton = screen.getByText("Seen");

  const runtime = screen.getByText(`${movieExample.runtime} minutes`);
  const rating = screen.getByText(`${movieExample.rating} rating`);
  const release = screen.getByText(`released ${movieExample.release}`);
  const overview = screen.getByText(movieExample.overview);
  const slogan = screen.getByText(movieExample.slogan);
  const title = screen.getByText(movieExample.title);
  const poster = screen.getByAltText(`${movieExample.title} poster`);
});

test("onButtonPress is called correct number of times and with correct parameters", async () => {
  await act(async () =>
    render(
      <MemoryRouter initialEntries={[`/movies/111`]}>
        <NotificationContextProvider>
          <Routes>
            <Route
              path="/movies/:id"
              element={
                <Movie
                  user={{ username: "testUser" }}
                  onButtonPress={onButtonPress}
                  onButtonUnpress={onButtonUnpress}
                />
              }
            />
          </Routes>
        </NotificationContextProvider>
      </MemoryRouter>
    )
  );

  const user = userEvent.setup();

  const watchButton = screen.getByText("Watch");
  await user.click(watchButton);

  expect(onButtonPress.mock.calls).toHaveLength(1);
  expect(onButtonPress.mock.calls[0][1]).toBe("later");
  expect(onButtonPress.mock.calls[0][2]).toStrictEqual({
    id: movieExample.id,
    title: movieExample.title,
    poster: movieExample.image,
  });
});

test("onButtonUnpress is called correct number of times and with correct parameters", async () => {
  await act(async () =>
    render(
      <MemoryRouter initialEntries={[`/movies/111`]}>
        <NotificationContextProvider>
          <Routes>
            <Route
              path="/movies/:id"
              element={
                <Movie
                  user={{ username: "testUser" }}
                  onButtonPress={onButtonPress}
                  onButtonUnpress={onButtonUnpress}
                />
              }
            />
          </Routes>
        </NotificationContextProvider>
      </MemoryRouter>
    )
  );

  const user = userEvent.setup();

  const watchButton = screen.queryByText("Watch");
  await user.click(watchButton);

  const unwatchButton = screen.getByText("Unwatch");
  await user.click(unwatchButton);

  expect(onButtonUnpress.mock.calls).toHaveLength(1);
  expect(onButtonUnpress.mock.calls[0][1]).toBe("later");
  expect(onButtonUnpress.mock.calls[0][2]).toStrictEqual({
    id: movieExample.id,
  });
});

test("movie buttons are not rendered when there is no user", async () => {
  await act(async () =>
    render(
      <MemoryRouter initialEntries={[`/movies/111`]}>
        <NotificationContextProvider>
          <Routes>
            <Route
              path="/movies/:id"
              element={
                <Movie
                  onButtonPress={onButtonPress}
                  onButtonUnpress={onButtonUnpress}
                />
              }
            />
          </Routes>
        </NotificationContextProvider>
      </MemoryRouter>
    )
  );

  const watchButton = screen.queryByText("Watch");
  const favoriteButton = screen.queryByText("Favorite");
  const seenButton = screen.queryByText("Seen");

  expect(watchButton).toBeNull();
  expect(favoriteButton).toBeNull();
  expect(seenButton).toBeNull();
});
