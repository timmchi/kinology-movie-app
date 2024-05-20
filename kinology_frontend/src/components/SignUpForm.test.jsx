import { render, screen } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import { testSetup } from "../utils/testUtils";
import { expect, test } from "vitest";

test("Log in form is rendered correctly", () => {
  const { container } = render(<SignUpForm />);

  const username = screen.getByText("username");
  const password = screen.getByText("password");
  const confirmPassword = screen.getByText("confirm password");
  const name = screen.getByText("name");
  const email = screen.getByText("email");

  const button = container.querySelector("#signup-button");

  expect(username).toBeDefined();
  expect(password).toBeDefined();
  expect(confirmPassword).toBeDefined();
  expect(name).toBeDefined();
  expect(email).toBeDefined();
  expect(button).toBeDefined();
});

test("Sign Up form updates parent state and calls handleSignup", async () => {
  const handleSignup = vi.fn();

  const { user } = testSetup(<SignUpForm handleSignUp={handleSignup} />);

  const username = screen.getByPlaceholderText("username");
  const password = screen.getByPlaceholderText("password");
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

  const { user } = testSetup(<SignUpForm handleSignUp={handleSignup} />);

  const username = screen.getByPlaceholderText("username");
  const password = screen.getByPlaceholderText("password");
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

  expect(usernameError).toBeInTheDocument();
  expect(nameError).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();
  expect(passwordError).toBeInTheDocument();
  expect(confirmPasswordError).toBeInTheDocument();
});
