import { expect, test } from "vitest";
import CommentList from "./CommentList";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { UserContextProvider, UserContext } from "../../contexts/UserContext";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const testComments = [
  {
    id: 1,
    content: "Comment 1",
    author: { id: 1, name: "Comment Tester 1", username: "comment_tester1" },
    receiver: { username: "comment_receiver" },
  },
  {
    id: 2,
    content: "Comment 2",
    author: { id: 2, name: "Comment Tester 2", username: "comment_tester2" },
    receiver: { username: "comment_receiver" },
  },
  {
    id: 3,
    content: "Comment 3",
    author: { id: 3, name: "Comment Tester 3", username: "comment_tester3" },
    receiver: { username: "comment_receiver" },
  },
];

const currentUser = { username: "comment_tester1", id: 1 };

const onEdit = vi.fn();
const onDelete = vi.fn();

vi.mock("../../services/users", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      getUserAvatar: vi.fn().mockResolvedValue("avatarUrl"),
    },
  };
});

test("renders properly when there are no comments", () => {
  render(
    <UserContextProvider>
      <CommentList onEdit={onEdit} onDelete={onDelete} />
    </UserContextProvider>
  );

  const text = screen.getByText("No comments yet...");
  expect(text).toBeDefined();
});

test("renders properly when passed a list of comments", async () => {
  await act(async () =>
    render(
      <UserContextProvider>
        <MemoryRouter>
          <CommentList
            comments={testComments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </MemoryRouter>
      </UserContextProvider>
    )
  );

  const user1 = screen.getByText(testComments[0].author.name);
  const user2 = screen.getByText(testComments[1].author.name);
  const user3 = screen.getByText(testComments[2].author.name);

  expect(user1).toBeDefined();
  expect(user2).toBeDefined();
  expect(user3).toBeDefined();

  const user1Img = screen.getByAltText(`${testComments[0].author.name}`);
  const user2Img = screen.getByAltText(`${testComments[1].author.name}`);
  const user3Img = screen.getByAltText(`${testComments[2].author.name}`);

  expect(user1Img).toBeDefined();
  expect(user2Img).toBeDefined();
  expect(user3Img).toBeDefined();

  const user1Comment = screen.getByText(testComments[0].content);
  const user2Comment = screen.getByText(testComments[1].content);
  const user3Comment = screen.getByText(testComments[2].content);

  expect(user1Comment).toBeDefined();
  expect(user2Comment).toBeDefined();
  expect(user3Comment).toBeDefined();
});

test("onDelete function is called properly with correct params", async () => {
  await act(async () =>
    render(
      <MemoryRouter>
        <UserContext.Provider value={[currentUser, () => {}]}>
          <CommentList
            comments={testComments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </UserContext.Provider>
      </MemoryRouter>
    )
  );

  const user = userEvent.setup();

  const deleteButton = screen.getByText("Delete comment");
  await user.click(deleteButton);

  expect(onDelete.mock.calls).toHaveLength(1);
  expect(onDelete.mock.calls[0][0]).toBe(testComments[0].id);
});

test("onEdit function is called properly with correct params", async () => {
  await act(async () =>
    render(
      <MemoryRouter>
        <UserContext.Provider value={[currentUser, () => {}]}>
          <CommentList
            comments={testComments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </UserContext.Provider>
      </MemoryRouter>
    )
  );

  const user = userEvent.setup();

  const editCommentInput = document.getElementById(":r1:");
  await user.type(editCommentInput, "hello");

  const submitCommentButton = screen.getByText("Submit comment");
  await user.click(submitCommentButton);

  expect(onEdit.mock.calls).toHaveLength(1);
  expect(onEdit.mock.calls[0]).toStrictEqual([
    testComments[0].id,
    "hello",
    testComments[0].author.id,
  ]);
});
