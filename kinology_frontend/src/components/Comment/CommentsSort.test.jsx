import { render, screen } from "@testing-library/react";
import CommentsSort from "./CommentsSort";
import { testSetup } from "../../utils/testUtils";
import { expect, test } from "vitest";

const onSort = vi.fn();

test("renders properly when sortDesc is true", () => {
  render(<CommentsSort onSort={onSort} sortDesc={true} />);

  screen.getByText("Sorting by: Newest first");

  const icon = screen.getByTestId("SortIcon");
  expect(icon).toBeDefined();
});

test("renders properly when sortDesc is false", () => {
  render(<CommentsSort onSort={onSort} sortDesc={false} />);

  screen.getByText("Sorting by: Oldest first");

  const icon = screen.getByTestId("SortIcon");
  expect(icon).toBeDefined();
});

test("onSort is called correct number of times", async () => {
  const { user } = testSetup(<CommentsSort onSort={onSort} sortDesc={true} />);

  const icon = screen.getByTestId("SortIcon");

  await user.click(icon);

  expect(onSort.mock.calls).toHaveLength(1);
});
