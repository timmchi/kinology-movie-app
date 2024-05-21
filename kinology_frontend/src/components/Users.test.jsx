import { expect, test } from "vitest";
import { testSetup } from "../utils/testUtils";
import Users from "./Users";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";

const exampleUsers = [
  {
    id: 1,
    name: "User 1",
    username: "User_1",
  },
  {
    id: 2,
    name: "User 2",
    username: "User_2",
  },
  {
    id: 3,
    name: "User 3",
    username: "User_3",
  },
];

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

test("renders properly when there are no users", () => {
  render(<Users />);

  const text = screen.getByText("no users yet");
  expect(text).toBeInTheDocument();
});

test("renders properly with a list of users", async () => {
  await act(async () =>
    render(
      <MemoryRouter>
        <Users users={exampleUsers} />
      </MemoryRouter>
    )
  );

  const user1 = screen.getByText(exampleUsers[0].name);
  const user2 = screen.getByText(exampleUsers[1].name);
  const user3 = screen.getByText(exampleUsers[2].name);

  expect(user1).toBeInTheDocument();
  expect(user2).toBeInTheDocument();
  expect(user3).toBeInTheDocument();

  const user1Img = screen.getByAltText(`${exampleUsers[0].name}`);
  const user2Img = screen.getByAltText(`${exampleUsers[1].name}`);
  const user3Img = screen.getByAltText(`${exampleUsers[2].name}`);

  expect(user1Img).toBeInTheDocument();
  expect(user2Img).toBeInTheDocument();
  expect(user3Img).toBeInTheDocument();
});
