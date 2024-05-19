import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieButton from "./MovieButton";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";

test("movie button renders with correct text", () => {
  const unpressedText = "I am unpressed";
  const pressedText = "I was pressed";

  render(
    <MovieButton unpressedText={unpressedText} pressedText={pressedText} />
  );

  const button = screen.getByText("I am unpressed");
  expect(button).toBeDefined();
});

test("clicking the button calls event handler once and changes the text, pressing it calls event handler once", async () => {
  const unpressedText = "I am unpressed";
  const pressedText = "I was pressed";

  const mockPressHandler = vi.fn();
  const mockUnpressHandler = vi.fn();
  const user = userEvent.setup();

  render(
    <MovieButton
      unpressedText={unpressedText}
      pressedText={pressedText}
      onButtonPress={mockPressHandler}
      onButtonUnpress={mockUnpressHandler}
    />
  );

  const unpressedButton = screen.getByText("I am unpressed");
  expect(unpressedButton).toBeDefined();

  await user.click(unpressedButton);

  const pressedButton = screen.getByText("I was pressed");
  expect(pressedButton).toBeDefined();

  await user.click(pressedButton);

  expect(mockPressHandler.mock.calls).toHaveLength(1);
  expect(mockUnpressHandler.mock.calls).toHaveLength(1);
});
