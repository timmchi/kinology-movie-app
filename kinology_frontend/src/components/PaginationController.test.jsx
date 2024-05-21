import { expect, test } from "vitest";
import PaginationController from "./PaginationController";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testSetup } from "../utils/testUtils";

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
