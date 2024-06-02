import { render, screen } from "@testing-library/react";
import ContactForm from "./ContactForm";
import { NotificationContextProvider } from "../../contexts/NotificationContext";
import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

const setOpen = vi.fn();

test("renders properly with all field and a button", () => {
  render(
    <NotificationContextProvider>
      <ContactForm setOpen={setOpen} />
    </NotificationContextProvider>
  );

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/your message/i);

  const submitMessage = screen.getByText("Send message");

  expect(nameInput).toBeVisible();
  expect(emailInput).toBeVisible();
  expect(messageInput).toBeVisible();
  expect(submitMessage).toBeVisible();
});

test("contact form can be filled and submitted", async () => {
  const user = userEvent.setup();

  render(
    <NotificationContextProvider>
      <ContactForm setOpen={setOpen} />
    </NotificationContextProvider>
  );

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/your message/i);

  const submitMessage = screen.getByText("Send message");

  await user.type(nameInput, "Tester");
  await user.type(emailInput, "tester@example.com");
  await user.type(messageInput, "I am testing contact form submission");

  await user.click(submitMessage);
});
