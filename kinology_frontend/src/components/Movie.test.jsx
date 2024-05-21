import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Movie from "./Movie";
// import moviesService from "../services/movies";
import { expect, test, vi } from "vitest";
import { act } from "@testing-library/react";
import { NotificationContextProvider } from "../contexts/NotificationContext";

const onButtonPress = vi.fn();
const onButtonUnpress = vi.fn();

// let movieExample;

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
      getMovieComments: vi.fn().mockResolvedValue([]),
      createMovieComment: vi.fn().mockResolvedValue({
        id: "1",
        content: "Great movie!",
        user: { username: "testUser" },
        movieId: "111",
      }),
      deleteMovieComment: vi.fn().mockResolvedValue({}),
      updateMovieComment: vi.fn().mockResolvedValue({
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

  screen.debug();
});
