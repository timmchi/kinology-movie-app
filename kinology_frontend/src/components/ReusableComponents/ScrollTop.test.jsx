import { render, screen } from "@testing-library/react";
import ScrollTop from "./ScrollTop";
import { expect, test } from "vitest";
import { testSetup } from "../../utils/testUtils";

const goToSearch = vi.fn();

test("renders properly with arrow icon", () => {
  render(<ScrollTop goToSearch={goToSearch} />);

  const icon = screen.getByTestId("ArrowUpwardIcon");
  expect(icon).toBeDefined();
});

test("goToSearch is called correct number of times", async () => {
  const { user } = testSetup(<ScrollTop goToSearch={goToSearch} />);

  const icon = screen.getByTestId("ArrowUpwardIcon");

  await user.click(icon);

  expect(goToSearch.mock.calls).toHaveLength(1);
});
