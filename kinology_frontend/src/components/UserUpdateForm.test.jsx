import UserUpdateForm from "./UserUpdateForm";
import { expect, test } from "vitest";
import { testSetup } from "../utils/testUtils";
import { render, screen } from "@testing-library/react";

test("Update form is rendered correctly", () => {
  const { container } = render(<UserUpdateForm />);

  const bio = screen.getByText("About you");
  const avatar = screen.getByText("Avatar");
  const name = screen.getByText("Name");

  const button = container.querySelector("#update-button");

  expect(bio).toBeInTheDocument();
  expect(avatar).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  const bioInput = screen.getByPlaceholderText(
    "Write something about yourself"
  );
  const nameInput = screen.getByPlaceholderText("Change your name");

  expect(bioInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
});

test("Calls handleUpdate properly with correct data", async () => {
  const handleUpdate = vi.fn();
  const { user } = testSetup(<UserUpdateForm updateUser={handleUpdate} />);

  const bio = screen.getByPlaceholderText("Write something about yourself");
  const name = screen.getByPlaceholderText("Change your name");
  const avatar = screen.getByPlaceholderText("avatar");

  await user.type(bio, "bazinga");
  await user.type(name, "bazinga");

  const file = new File(["File contents"], "avatarExample.png", {
    type: "image/png",
  });

  await user.upload(avatar, file);

  expect(avatar.files[0]).toBe(file);
  expect(avatar.files.item(0)).toBe(file);
  expect(avatar.files).toHaveLength(1);

  const button = screen.getByText("Update your profile");

  await user.click(button);

  expect(handleUpdate.mock.calls).toHaveLength(1);

  const formData = handleUpdate.mock.calls[0][0];
  expect(formData instanceof FormData).toBe(true);

  expect(formData.get("bio")).toBe("bazinga");
  expect(formData.get("name")).toBe("bazinga");
  expect(formData.get("avatar")).toBe(file);
});
