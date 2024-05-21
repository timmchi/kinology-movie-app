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

  expect(screen.getByText("Welcome to")).toBeInTheDocument();
  expect(screen.getByText("Kinology")).toBeInTheDocument();
  expect(screen.getByText(/Choosing a movie made easy/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Pick actors, directors or genres/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Too many good options to choose from?/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Create an account to save movies for later!/i)
  ).toBeInTheDocument();

  const searchButton = screen.getByRole("button", { name: /search/i });
  expect(searchButton).toBeInTheDocument();
  expect(searchButton).toHaveClass("CTA-search");
  expect(searchButton).toHaveStyle("background-color: rgb(121, 84, 88);");
  expect(screen.getByText(/search/i).closest("a")).toHaveAttribute(
    "href",
    "#search-function"
  );

  const registerButton = screen.getByRole("button", { name: /register/i });
  expect(registerButton).toBeInTheDocument();
  expect(registerButton).toHaveClass("CTA-register");
  expect(registerButton).toHaveStyle("background-color: rgb(143, 145, 107);");
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
