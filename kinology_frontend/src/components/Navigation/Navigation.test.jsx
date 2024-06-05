import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import About from "../About/About";
import SignUpForm from "../SignUp/SignUpForm";
import LogIn from "../Auth/LogIn";
import { describe, expect, test } from "vitest";

test("renders correctly when the user is null", () => {
  render(
    <MemoryRouter>
      <Navigation user={null} />
    </MemoryRouter>
  );

  const siteTitles = screen.getAllByText("Kinology");
  const abouts = screen.getAllByText("About");
  const logins = screen.getAllByText("Log in");
  const signups = screen.getAllByText("Sign up");

  expect(siteTitles).toBeDefined();
  expect(abouts).toBeDefined();
  expect(logins).toBeDefined();
  expect(signups).toBeDefined();
});

test("renders correctly when the user is logged in", () => {
  render(
    <MemoryRouter>
      <Navigation user={{ username: "user" }} />
    </MemoryRouter>
  );

  const siteTitles = screen.getAllByText("Kinology");
  const abouts = screen.getAllByText("About");
  const users = screen.getAllByText("Users");
  const logoutButtons = screen.getAllByText("log out");

  expect(siteTitles).toBeDefined();
  expect(abouts).toBeDefined();
  expect(users).toBeDefined();
  expect(logoutButtons[0]).toBeDefined();
  expect(logoutButtons[1]).toBeDefined();
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

    fireEvent.click(screen.getAllByText("About")[1]);
    expect(screen.getByText(/About me/i)).toBeDefined();
    expect(screen.getByText(/my favorite movies/i)).toBeDefined();
    expect(screen.getByText(/Web app uses TMDB api/i)).toBeDefined();
    expect(screen.getByText(/Fullstack open/i)).toBeDefined();
  });

  test("signup form can be accessed through navigation", () => {
    render(
      <NotificationContextProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Navigation user={null} />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </MemoryRouter>
      </NotificationContextProvider>
    );

    fireEvent.click(screen.getAllByText("Sign up")[1]);

    const username = screen.getByText("Username");
    const password = screen.getByText("Password");
    const confirmPassword = screen.getByText("Confirm Password");
    const name = screen.getByText("Name");
    const email = screen.getByText("Email");

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

    const loginButtons = screen.getAllByText("Log in");

    fireEvent.click(loginButtons[1]);
    const username = screen.getByText("Username");
    const password = screen.getByText("Password");

    expect(username).toBeDefined();
    expect(password).toBeDefined();
  });
});

describe("local storage test", () => {
  const removeItemMock = vi.spyOn(Storage.prototype, "removeItem");

  test("handles logout function correctly", () => {
    render(
      <MemoryRouter>
        <Navigation user={{ username: "user" }} />
      </MemoryRouter>
    );

    const logoutButtons = screen.getAllByText("log out");
    fireEvent.click(logoutButtons[1]);

    expect(removeItemMock).toHaveBeenCalledWith("loggedKinologyUser");
  });
});
