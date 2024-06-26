import { render, screen } from "@testing-library/react";
import CommentForm from "./CommentForm";
import { testSetup } from "../../utils/testUtils";
import { expect, test } from "vitest";

test("Comment form is rendered correctly", () => {
  const { container } = render(<CommentForm label={"Your comment"} />);

  const comment = screen.getAllByText("Your comment");
  const input = screen.getByRole("textbox");

  const button = container.querySelector("#comment-button");

  expect(comment).toBeDefined();
  expect(input).toBeDefined();
  expect(button).toBeDefined();
});

test("Comment form correctly calls commentAction", async () => {
  const commentAction = vi.fn();

  const { user } = testSetup(
    <CommentForm
      commentAction={commentAction}
      commentId={"1"}
      authorId={"1"}
      label={"Your comment"}
    />
  );

  const content = document.getElementById(":r1:");
  const button = screen.getByText("Submit comment");

  await user.type(content, "I am commenting");
  await user.click(button);

  expect(commentAction.mock.calls).toHaveLength(1);
  expect(commentAction.mock.calls[0]).toStrictEqual([
    "I am commenting",
    "1",
    "1",
  ]);
});

test("Comment form validated correctly", async () => {
  const commentAction = vi.fn();

  const { user } = testSetup(
    <CommentForm commentAction={commentAction} commentId={"1"} authorId={"1"} />
  );

  const content = document.getElementById(":r0:");
  const button = screen.getByText("Submit comment");

  await user.click(button);

  expect(commentAction.mock.calls).toHaveLength(0);

  const commentError = screen.getByText(/Comment must be a string/i);
  expect(commentError).toBeDefined();
});
