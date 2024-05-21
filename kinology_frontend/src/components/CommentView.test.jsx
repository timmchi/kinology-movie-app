import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentView from "./CommentView";
import usersService from "../services/users";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import { act } from "@testing-library/react";
import { testSetup } from "../utils/testUtils";

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

const comment = {
  id: 1,
  content: "Comment by me",
  author: { id: 1, name: "Comment Tester", username: "comment_tester" },
  receiver: { username: "comment_receiver" },
};

const currentUser = { username: "comment_tester" };

const editForm = (commentId, authorId) => (
  <button>Edit comment {commentId}</button>
);

const onDelete = vi.fn();

test("render comment with avatar correctly", async () => {
  await act(async () =>
    render(
      <MemoryRouter>
        <CommentView
          comment={comment}
          currentUser={currentUser}
          editForm={editForm}
          onDelete={onDelete}
        />
      </MemoryRouter>
    )
  );

  await act(async () => {
    await waitFor(() =>
      expect(usersService.getUserAvatar).toHaveBeenCalledWith(comment.author.id)
    );
  });

  const avatar = screen.getByAltText(comment.author.name);
  expect(avatar).toHaveAttribute("src", "avatarUrl");

  const commentAuthor = screen.getByText(comment.author.name);
  expect(commentAuthor).toBeDefined();

  const commentText = screen.getByText(comment.content);
  expect(commentText).toBeDefined();
});

test("Component renders edit and delete buttons for comment author", async () => {
  await act(async () =>
    render(
      <MemoryRouter>
        <CommentView
          comment={comment}
          currentUser={currentUser}
          editForm={editForm}
          onDelete={onDelete}
        />
      </MemoryRouter>
    )
  );

  const editButton = screen.getByText(`Edit comment ${comment.id}`);
  expect(editButton).toBeDefined();

  const deleteButton = screen.getByText("Delete comment");
  expect(deleteButton).toBeDefined();
});

test("OnDelete is called when button is clicked", async () => {
  const { user } = testSetup(
    <MemoryRouter>
      <CommentView
        comment={comment}
        currentUser={currentUser}
        editForm={editForm}
        onDelete={onDelete}
      />
    </MemoryRouter>
  );

  const deleteButton = screen.getByText("Delete comment");
  await user.click(deleteButton);

  expect(onDelete.mock.calls).toHaveLength(1);
  expect(onDelete).toHaveBeenCalledWith(comment.id, comment.author.id);
});

test("Delete button is rendered for the comment receiver", async () => {
  const commentReceiver = { username: "comment_receiver" };

  await act(async () =>
    render(
      <MemoryRouter>
        <CommentView
          comment={comment}
          currentUser={commentReceiver}
          editForm={editForm}
          onDelete={onDelete}
        />
      </MemoryRouter>
    )
  );

  const deleteButton = screen.getByText("Delete comment");
  expect(deleteButton).toBeDefined();
});

test("delete and edit buttons are not rendered for other users", async () => {
  const otherUser = { username: "other_user" };

  await act(async () =>
    render(
      <MemoryRouter>
        <CommentView
          comment={comment}
          currentUser={otherUser}
          editForm={editForm}
          onDelete={onDelete}
        />
      </MemoryRouter>
    )
  );

  const editButton = screen.queryByText(`Edit comment ${comment.id}`);
  expect(editButton).toBeNull();

  const deleteButton = screen.queryByText("Delete comment");
  expect(deleteButton).toBeNull();
});
