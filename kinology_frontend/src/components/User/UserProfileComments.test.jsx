import { render, screen, waitFor } from "@testing-library/react";
import UserProfileComments from "./UserProfileComments";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

const mockUser = { id: 1, username: "user" };

const commentCreateForm = () => "hello world";

const mockComments = [];

const deleteComment = vi.fn();
const updateComment = vi.fn();

test("renders the comment create form when the user is logged in", () => {
  render(
    <UserProfileComments
      currentUser={mockUser}
      commentCreateForm={commentCreateForm}
      comments={mockComments}
      deleteComment={deleteComment}
      updateComment={updateComment}
    />
  );

  screen.getByText("Comments");
  screen.getByText("hello world");
});

test("renders the comment create form when the user is not in", () => {
  render(
    <UserProfileComments
      currentUser={null}
      commentCreateForm={commentCreateForm}
      comments={mockComments}
      deleteComment={deleteComment}
      updateComment={updateComment}
    />
  );

  screen.getByText("Comments");
  const nullForm = screen.queryByText("hello world");
  expect(nullForm).toBeNull();
});
