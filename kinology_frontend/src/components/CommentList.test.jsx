import { expect, test } from "vitest";
import { testSetup } from "../utils/testUtils";
import CommentList from "./CommentList";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";

const currentUser = { username: "comment_tester" };

const onEdit = vi.fn();
const onDelete = vi.fn();

test("renders properly when there are no comments", () => {
  render(
    <CommentList
      onEdit={onEdit}
      onDelete={onDelete}
      currentUser={currentUser}
    />
  );

  const text = screen.getByText("no comments yet...");
  expect(text).toBeInTheDocument();
});
