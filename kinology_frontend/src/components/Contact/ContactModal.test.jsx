import { render, screen } from "@testing-library/react";
import ContactModal from "./ContactModal";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

test("renders button correctly", () => {
  render(
    <NotificationContextProvider>
      <ContactModal />
    </NotificationContextProvider>
  );

  expect(screen.getByText("Contact Me")).toBeVisible();
});

test("modal button can be clicked and it will reveal contact form", async () => {
  const user = userEvent.setup();

  render(
    <NotificationContextProvider>
      <ContactModal />
    </NotificationContextProvider>
  );

  const modalButton = screen.getByText("Contact Me");
  await user.click(modalButton);

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/your message/i);

  const submitMessage = screen.getByText("Send message");

  expect(nameInput).toBeVisible();
  expect(emailInput).toBeVisible();
  expect(messageInput).toBeVisible();
  expect(submitMessage).toBeVisible();
});
