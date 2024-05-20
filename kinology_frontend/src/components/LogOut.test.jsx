import { render, screen } from "@testing-library/react";
import LogOut from "./LogOut";
import { testSetup } from "../utils/testUtils";
import { expect, test } from "vitest";

test("Element renders correctly", () => {
  render(<LogOut />);

  const logoutButton = screen.getByText("log out");

  expect(logoutButton).toBeDefined();
});

test("LogOut correctly calls handleLogout", async () => {
  const handleLogout = vi.fn();

  const { user } = testSetup(<LogOut handleLogout={handleLogout} />);

  const logoutButton = screen.getByText("log out");

  await user.click(logoutButton);

  expect(handleLogout.mock.calls).toHaveLength(1);
});
