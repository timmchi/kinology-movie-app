import { render, screen } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import { testSetup } from "../utils/testUtils";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

test("Sign up form is rendered correctly", () => {
  const { container } = render(
    <MemoryRouter>
      <SignUpForm />
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

test("Sign Up form updates parent state and calls handleSignup", async () => {
  const handleSignup = vi.fn();

  const { user } = testSetup(
    <MemoryRouter>
      <SignUpForm handleSignUp={handleSignup} />
    </MemoryRouter>
  );

  const username = screen.getByPlaceholderText("username");
  const password = screen.getByPlaceholderText("password...");
  const name = screen.getByPlaceholderText("name");
  const confirmPw = screen.getByPlaceholderText("confirm password");
  const email = screen.getByPlaceholderText("email");
  const signupButton = screen.getByText("Sign Up");

  await user.type(username, "tester");
  await user.type(name, "Mr Tester");
  await user.type(email, "tester@example.com");
  await user.type(password, "password");
  await user.type(confirmPw, "password");
  await user.click(signupButton);

  expect(handleSignup.mock.calls).toHaveLength(1);

  expect(handleSignup.mock.calls[0][0].username).toBe("tester");
  expect(handleSignup.mock.calls[0][0].name).toBe("Mr Tester");
  expect(handleSignup.mock.calls[0][0].email).toBe("tester@example.com");
  expect(handleSignup.mock.calls[0][0].password).toBe("password");
  expect(handleSignup.mock.calls[0][0].passwordConfirm).toBe("password");
});

test("form fields are validated", async () => {
  const handleSignup = vi.fn();

  const { user } = testSetup(
    <MemoryRouter>
      <SignUpForm handleSignUp={handleSignup} />
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

  expect(handleSignup.mock.calls).toHaveLength(0);

  const usernameError = screen.getByText(
    /Username should be 3 or more symbols/i
  );
  const emailError = screen.getByText(/The email address is badly formatted/i);
  const nameError = screen.getByText(
    /Name or nickname should be 3 or more symbols/i
  );
  const passwordError = screen.getByText(
    /Your password must have 6 characters or more./i
  );
  const confirmPasswordError = screen.getByText(
    /The two passwords do not match/i
  );

  expect(usernameError).toBeDefined();
  expect(nameError).toBeDefined();
  expect(emailError).toBeDefined();
  expect(passwordError).toBeDefined();
  expect(confirmPasswordError).toBeDefined();
});
