import { render, screen, waitFor } from "@testing-library/react";
import EditProfileButtons from "./EditProfileButtons";
import { MemoryRouter } from "react-router-dom";
import { UserContextProvider, UserContext } from "../../contexts/UserContext";
import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

const mockUserProfile = { username: "bazinga" };
const mockCurrentUser = { username: "user" };

const updateForm = () => {
  return "hello world";
};
const deleteUser = vi.fn();

test("renders nothing when there is no logged in user", () => {
  render(
    <UserContextProvider>
      <EditProfileButtons
        user={mockUserProfile}
        updateForm={updateForm}
        deleteUser={deleteUser}
      />
    </UserContextProvider>
  );

  const deleteButton = screen.queryByText("Delete user");
  expect(deleteButton).toBeNull();
  const helloWorld = screen.queryByText("hello world");
  expect(helloWorld).toBeNull();
});

test("renders Delete button when the logged in user and profile owner are the same", () => {
  render(
    <UserContext.Provider value={[mockUserProfile, () => {}]}>
      <EditProfileButtons
        user={mockUserProfile}
        updateForm={updateForm}
        deleteUser={deleteUser}
      />
    </UserContext.Provider>
  );

  screen.getByText("Delete user");
  screen.getByText("hello world");
});

test("does not render buttons when the logged in user is not the profile owner", () => {
  render(
    <UserContext.Provider value={[mockCurrentUser, () => {}]}>
      <EditProfileButtons
        user={mockUserProfile}
        updateForm={updateForm}
        deleteUser={deleteUser}
      />
    </UserContext.Provider>
  );

  const deleteButton = screen.queryByText("Delete user");
  expect(deleteButton).toBeNull();
  const helloWorld = screen.queryByText("hello world");
  expect(helloWorld).toBeNull();
});

test("deleteUser is called correct number of times", async () => {
  render(
    <UserContext.Provider value={[mockUserProfile, () => {}]}>
      <EditProfileButtons
        user={mockUserProfile}
        updateForm={updateForm}
        deleteUser={deleteUser}
      />
    </UserContext.Provider>
  );

  const user = userEvent.setup();

  const deleteButton = screen.getByText("Delete user");
  await user.click(deleteButton);

  expect(deleteUser.mock.calls).toHaveLength(1);
});
