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

  expect(screen.getByText("Welcome to")).toBeDefined();
  expect(screen.getByText("Kinology")).toBeDefined();

  const cards = container.querySelector(".cardsContainer");
  expect(cards).not.toBeNull();

  expect(screen.getByText("Open Search")).toBeDefined();
  expect(screen.getByText("clear search")).toBeDefined();
});
