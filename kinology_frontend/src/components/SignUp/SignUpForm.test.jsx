import { render, screen } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import { testSetup } from "../../utils/testUtils";
import { MemoryRouter } from "react-router-dom";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import { expect, test } from "vitest";

const addUser = vi.fn();

test("Sign up form is rendered correctly", () => {
  const { container } = render(
    <MemoryRouter>
      <NotificationContextProvider>
        <SignUpForm addUser={addUser} />
      </NotificationContextProvider>
    </MemoryRouter>
  );

  const username = screen.getByText("Username");
  const password = screen.getByText("Password");
  const confirmPassword = screen.getByText("Confirm Password");
  const name = screen.getByText("Name");
  const email = screen.getByText("Email");

  const usernameInput = screen.getByPlaceholderText("username");
  const passwordInput = screen.getByPlaceholderText("password...");
  const nameInput = screen.getByPlaceholderText("name");
  const confirmPwInput = screen.getByPlaceholderText("confirm password");
  const emailInput = screen.getByPlaceholderText("email");

  const button = container.querySelector("#signup-button");

  expect(username).toBeDefined();
  expect(password).toBeDefined();
  expect(confirmPassword).toBeDefined();
  expect(name).toBeDefined();
  expect(email).toBeDefined();
  expect(button).toBeDefined();

  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
  expect(confirmPwInput).toBeDefined();
  expect(nameInput).toBeDefined();
  expect(emailInput).toBeDefined();
});

test("form fields are validated", async () => {
  const { user } = testSetup(
    <MemoryRouter>
      <NotificationContextProvider>
        <SignUpForm addUser={addUser} />
      </NotificationContextProvider>
    </MemoryRouter>
  );

  const username = screen.getByPlaceholderText("username");
  const password = screen.getByPlaceholderText("password...");
  const name = screen.getByPlaceholderText("name");
  const confirmPw = screen.getByPlaceholderText("confirm password");
  const email = screen.getByPlaceholderText("email");
  const signupButton = screen.getByText("Sign Up");

  await user.type(username, "t");
  await user.type(name, "M");
  await user.type(email, "t");
  await user.type(password, "p");
  await user.type(confirmPw, "x");
  await user.click(signupButton);

  expect(addUser.mock.calls).toHaveLength(0);

  const usernameError = screen.getByText(
    /Username should be 3 or more symbols/i
  );
  const emailError = screen.getByText(/The email address is badly formatted/i);
  const nameError = screen.getByText(
    /Name or nickname should be 3 or more symbols/i
  );
  const passwordError = screen.getByText(
    /Your password must have 8 characters or more./i
  );

  expect(usernameError).toBeDefined();
  expect(nameError).toBeDefined();
  expect(emailError).toBeDefined();
  expect(passwordError).toBeDefined();
});
