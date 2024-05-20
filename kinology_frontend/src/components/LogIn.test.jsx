import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogIn from "./LogIn";
import { beforeEach, describe, expect, test } from "vitest";

test("Log in form is rendered correctly", () => {
  const { container } = render(<LogIn />);

  const username = screen.getByText("username");
  const password = screen.getByText("password");

  const button = container.querySelector("#login-button");

  expect(username).toBeDefined();
  expect(password).toBeDefined();
  expect(button).toBeDefined();
});

test("Log In form updates parent state and calls handleLogin", async () => {
  const handleLogin = vi.fn();
  const user = userEvent.setup();

  render(<LogIn handleLogin={handleLogin} />);

  const username = screen.getByPlaceholderText("username...");
  const password = screen.getByPlaceholderText("password...");
  const loginButton = screen.getByText("Log In");

  await user.type(username, "tester");
  await user.type(password, "password");
  await user.click(loginButton);

  expect(handleLogin.mock.calls).toHaveLength(1);
  expect(handleLogin.mock.calls[0][0].username).toBe("tester");
  expect(handleLogin.mock.calls[0][0].password).toBe("password");
});
