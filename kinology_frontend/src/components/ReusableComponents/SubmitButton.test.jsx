import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import SubmitButton from "./SubmitButton";

test("renders button with normal text when isSubmitting is false", () => {
  render(
    <SubmitButton
      isSubmitting={false}
      submittingText="Not this"
      normalText="Correct text"
    />
  );

  expect(screen.getByText("Correct text")).toBeDefined();
  expect(screen.queryByText("Not this")).toBeNull();
});

test("renders button with submitting text when isSubmitting is true", () => {
  render(
    <SubmitButton
      isSubmitting={true}
      submittingText="Not this"
      normalText="Correct text"
    />
  );

  expect(screen.getByText("Not this")).toBeDefined();
  expect(screen.queryByText("Correct text")).toBeNull();
});
