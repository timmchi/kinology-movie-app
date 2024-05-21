import { expect, test } from "vitest";
import PaginationController from "./PaginationController";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const setPage = vi.fn();
const pageChange = vi.fn();

test("correctly renders with 5 pages", () => {
  render(
    <PaginationController
      pages={5}
      page={1}
      setPage={setPage}
      pageChange={pageChange}
    />
  );

  const one = screen.getByText("1");
  const two = screen.getByText("2");
  const three = screen.getByText("3");
  const four = screen.getByText("4");
  const five = screen.getByText("5");

  expect(one).toBeInTheDocument();
  expect(two).toBeInTheDocument();
  expect(three).toBeInTheDocument();
  expect(four).toBeInTheDocument();
  expect(five).toBeInTheDocument();

  const pagination = screen.queryByLabelText("pagination navigation");
  expect(pagination).toBeInTheDocument();
});

test("does not render pagination when pages is -1", () => {
  render(
    <PaginationController
      pages={-1}
      page={1}
      setPage={setPage}
      pageChange={pageChange}
    />
  );

  const pagination = screen.queryByLabelText("pagination navigation");
  expect(pagination).toBeNull();
});

test("calls setPage and pageChange with correct data when a page is changed", async () => {
  render(
    <PaginationController
      pages={5}
      page={1}
      setPage={setPage}
      pageChange={pageChange}
    />
  );

  const user = userEvent.setup();

  const two = screen.getByText("2");

  await user.click(two);

  expect(setPage.mock.calls).toHaveLength(1);
  expect(pageChange.mock.calls).toHaveLength(1);
  expect(setPage.mock.calls[0][0]).toBe(2);
  expect(pageChange.mock.calls[0][1]).toBe(2);
});

test("if number of pages is above 10, 10th page is the maximum rendered", () => {
  render(
    <PaginationController
      pages={12}
      page={1}
      setPage={setPage}
      pageChange={pageChange}
    />
  );

  const one = screen.getByText("1");
  const ten = screen.getByText("10");

  expect(one).toBeInTheDocument();
  expect(ten).toBeInTheDocument();

  const eleven = screen.queryByText("11");
  const twelve = screen.queryByText("12");

  expect(eleven).toBeNull();
  expect(twelve).toBeNull();
});
