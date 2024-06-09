import { render, screen, waitFor } from "@testing-library/react";
import UserAvatarAndEdit from "./UserAvatarAndEdit";
import { UserContextProvider, UserContext } from "../../contexts/UserContext";
import { expect, test } from "vitest";

const mockUserProfile = { username: "bazinga" };

const updateForm = () => {
  return "hello world";
};
const deleteUser = vi.fn();
const setAvatar = vi.fn();

test("renders avatar with correct alt-text", () => {
  render(
    <UserContextProvider>
      <UserAvatarAndEdit
        updateForm={updateForm}
        deleteUser={deleteUser}
        user={mockUserProfile}
        setAvatar={setAvatar}
        avatar={"avatar"}
      />
    </UserContextProvider>
  );

  screen.getByAltText("user avatar");
});

test("renders with EditProfileButtons when the logged in user is the profile owner", () => {
  render(
    <UserContext.Provider value={[mockUserProfile, () => {}]}>
      <UserAvatarAndEdit
        updateForm={updateForm}
        deleteUser={deleteUser}
        user={mockUserProfile}
        setAvatar={setAvatar}
        avatar={"avatar"}
      />
    </UserContext.Provider>
  );

  screen.getByAltText("user avatar");
  screen.getByText("Delete user");
  screen.getByText("hello world");
});
