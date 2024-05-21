import LandingPage from "./LandingPage";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

test("landing page renders properly", () => {
  const { container } = render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );

  expect(screen.getByText("Welcome to")).toBeInTheDocument();
  expect(screen.getByText("Kinology")).toBeInTheDocument();

  const cards = container.querySelector(".cardsContainer");
  expect(cards).not.toBeNull();

  const searchBar = container.querySelector(".searchBar");
  expect(searchBar).not.toBeNull();
  expect(screen.getByText("new search")).toBeInTheDocument();
});
