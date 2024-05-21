import { render, screen } from "@testing-library/react";
import NotificationAlert from "./Notification";
import { NotificationContext } from "../contexts/NotificationContext";
import { expect, test } from "vitest";

const renderWithContext = (contextValue) => {
  return render(
    <NotificationContext.Provider value={contextValue}>
      <NotificationAlert />
    </NotificationContext.Provider>
  );
};

test("does not render when the message is null", () => {
  const contextValue = [{ message: null, type: "success" }, () => {}];
  renderWithContext(contextValue);

  const alert = screen.queryByRole("alert");
  expect(alert).toBeNull();
});

test("success notification is rendered correctly", () => {
  const contextValue = [
    { message: "I was successful", type: "success" },
    () => {},
  ];
  renderWithContext(contextValue);

  const alert = screen.getByRole("alert");
  expect(alert).toBeDefined();
  expect(alert).toHaveTextContent("I was successful");
  expect(alert).toHaveClass("MuiAlert-standardSuccess");
});

test("error notification is rendered correctly", () => {
  const contextValue = [{ message: "I am an error", type: "error" }, () => {}];
  renderWithContext(contextValue);

  const alert = screen.getByRole("alert");
  expect(alert).toBeDefined();
  expect(alert).toHaveTextContent("I am an error");
  expect(alert).toHaveClass("MuiAlert-standardError");
});
