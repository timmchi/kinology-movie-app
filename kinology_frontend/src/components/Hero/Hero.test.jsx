import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import Hero from "./Hero";
import { expect, test } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

test("renders Hero component correctly", () => {
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  );

  expect(screen.getByText("Welcome to")).toBeDefined();
  expect(screen.getByText("Kinology")).toBeDefined();
  expect(screen.getByText(/Choosing a movie made easy/i)).toBeDefined();
  expect(screen.getByText(/Pick actors, directors or genres/i)).toBeDefined();
  expect(
    screen.getByText(/Too many good options to choose from?/i)
  ).toBeDefined();
  expect(
    screen.getByText(/Create an account to save movies for later!/i)
  ).toBeDefined();

  const searchButton = screen.getByRole("button", { name: /search/i });
  expect(searchButton).toBeDefined();
  expect(searchButton).toHaveClass("CTA-search");
  expect(searchButton).toHaveStyle("background-color: rgb(0, 117, 95);");

  const registerButton = screen.getByRole("button", { name: /register/i });
  expect(registerButton).toBeDefined();
  expect(registerButton).toHaveClass("CTA-register");
  expect(registerButton).toHaveStyle("background-color: rgb(0, 83, 47);");
});

test("navigates to signup on register button click", async () => {
  render(
    <BrowserRouter>
      <Hero />
    </BrowserRouter>
  );

  const registerButton = screen.getByRole("button", { name: /register/i });
  fireEvent.click(registerButton);

  expect(mockNavigate).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/signup");
});
