import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";
import { beforeEach, describe, expect, test } from "vitest";

describe("<Togglable /> tests", () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show">
        <div className="testDiv">i am the togglable child</div>
      </Togglable>
    ).container;
  });

  test("renders children", async () => {
    await screen.findAllByText("i am the togglable child");
  });

  test("children are not displayed initially", () => {
    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });

  test("children are displayed after clicking the button", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);

    const div = container.querySelector(".togglableContent");
    expect(div).not.toHaveStyle("display: none");
  });

  test("toggled content can be closed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);

    const closeButton = screen.getByText("cancel");
    await user.click(closeButton);

    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });
});
