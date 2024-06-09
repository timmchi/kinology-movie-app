import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import { UserContextProvider, UserContext } from "../../contexts/UserContext";
import About from "../About/About";
import SignUpForm from "../SignUp/SignUpForm";
import LogIn from "../Auth/LogIn";
import { describe, expect, test } from "vitest";

const renderWithUserContext = (children, { initialUser } = {}) => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <UserContextProvider>
        <UserContext.Provider value={[initialUser, () => {}]}>
          {children}
        </UserContext.Provider>
      </UserContextProvider>
    </MemoryRouter>
  );
};

test("renders correctly when the user is null", () => {
  renderWithUserContext(<Navigation />, { initialUser: null });

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
  const mockUser = { username: "user" };

  renderWithUserContext(<Navigation />, { initialUser: mockUser });

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
      <UserContextProvider value={null}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Navigation />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </MemoryRouter>
      </UserContextProvider>
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
        <UserContextProvider value={null}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<Navigation />} />
              <Route path="/signup" element={<SignUpForm />} />
            </Routes>
          </MemoryRouter>
        </UserContextProvider>
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
      <UserContextProvider value={null}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Navigation />} />
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </MemoryRouter>
      </UserContextProvider>
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
  const mockUser = { username: "user" };

  test("handles logout function correctly", () => {
    renderWithUserContext(<Navigation />, { initialUser: mockUser });

    const logoutButtons = screen.getAllByText("log out");
    fireEvent.click(logoutButtons[1]);

    expect(removeItemMock).toHaveBeenCalledWith("loggedKinologyUser");
  });
});
