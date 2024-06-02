import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserSingleListView from "./UserSingleListView";
import usersService from "../../services/users";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import { act } from "@testing-library/react";
import { testSetup } from "../../utils/testUtils";

vi.mock("../services/users", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      getUserAvatar: vi.fn().mockResolvedValue("avatarUrl"),
    },
  };
});

const user = { id: 1, name: "User Tester", username: "user_tester" };

test("renders user with avatar correctly", async () => {
  render(
    <MemoryRouter>
      <UserSingleListView user={user} />
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(usersService.getUserAvatar).toHaveBeenCalledWith(user.id)
  );

  const avatar = screen.getByAltText(user.name);
  expect(avatar).toHaveAttribute("src", "avatarUrl");

  const userElement = screen.getByText(user.name);
  expect(userElement).toBeDefined();
});
