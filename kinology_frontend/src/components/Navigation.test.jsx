import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import About from "./About";
import SignUpForm from "./SignUpForm";
import LogIn from "./LogIn";
import { afterEach, describe, expect, test } from "vitest";

test("renders correctly when the user is null", () => {
  render(
    <MemoryRouter>
      <Navigation user={null} />
    </MemoryRouter>
  );

  const siteTitle = screen.getByText("Kinology");
  const about = screen.getByText("About");
  const login = screen.getByText("Log in");
  const signup = screen.getByText("Sign up");

  expect(siteTitle).toBeDefined();
  expect(about).toBeDefined();
  expect(login).toBeDefined();
  expect(signup).toBeDefined();
});

test("renders correctly when the user is logged in", () => {
  render(
    <MemoryRouter>
      <Navigation user={{ username: "user" }} />
    </MemoryRouter>
  );

  const siteTitle = screen.getByText("Kinology");
  const about = screen.getByText("About");
  const users = screen.getByText("Users");
  const logout = screen.getByText("log out");

  expect(siteTitle).toBeDefined();
  expect(about).toBeDefined();
  expect(users).toBeDefined();
  expect(logout).toBeDefined();
});

describe("testing routes", () => {
  test("about page can be accessed through navigation", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Navigation user={null} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("About"));
    expect(screen.getByText(/About me/i)).toBeDefined();
    expect(screen.getByText(/my favorite movies/i)).toBeDefined();
    expect(screen.getByText(/Web app uses TMDB api/i)).toBeDefined();
    expect(screen.getByText(/Fullstack open/i)).toBeDefined();
  });

  test("signup form can be accessed through navigation", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Navigation user={null} />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Sign up"));

    const username = screen.getByText("username");
    const password = screen.getByText("password");
    const confirmPassword = screen.getByText("confirm password");
    const name = screen.getByText("name");
    const email = screen.getByText("email");

    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(confirmPassword).toBeDefined();
    expect(name).toBeDefined();
    expect(email).toBeDefined();
  });

  test("log in form can be accessed through navigation", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Navigation user={null} />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </MemoryRouter>
    );

    const login = screen.getByText("Log in");

    fireEvent.click(login);
    const username = screen.getByText("username");
    const password = screen.getByText("password");

    expect(username).toBeDefined();
    expect(password).toBeDefined();
  });
});

describe("local storage test", () => {
  const removeItemMock = vi.spyOn(Storage.prototype, "removeItem");

  //   afterEach(() => {
  //     localStorage.clear();
  //   });

  test("handles logout function correctly", () => {
    render(
      <MemoryRouter>
        <Navigation user={{ username: "user" }} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("log out");
    fireEvent.click(logoutButton);

    expect(removeItemMock).toHaveBeenCalledWith("loggedKinologyUser");
  });
});
