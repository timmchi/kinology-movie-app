import { render, screen } from "@testing-library/react";
import LogOut from "./LogOut";
import { testSetup } from "../utils/testUtils";
import { expect, test } from "vitest";

test("Element renders correctly", () => {
  render(<LogOut />);

  const logoutButton = screen.getByText("log out");

  expect(logoutButton).toBeDefined();
});
