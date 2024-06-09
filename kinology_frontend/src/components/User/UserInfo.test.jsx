import { render, screen, waitFor } from "@testing-library/react";
import UserInfo from "./UserInfo";
import { expect, test } from "vitest";

test("renders properly when bio and name are provided", () => {
  render(
    <UserInfo name={"User Name"} biography={"I am testing this component"} />
  );

  screen.getByText("User Name");
  screen.getByText("About me");
  screen.getByText("I am testing this component");
});

test("renders with placeholders when bio and/or name are not provided", () => {
  render(<UserInfo />);

  screen.getByText("Anonymous user");
  screen.getByText("About me");
  screen.getByText("We don't know anything about them yet");
});

test("renders with placeholders when bio and/or name are empty", () => {
  render(<UserInfo name={""} biography={""} />);

  screen.getByText("Anonymous user");
  screen.getByText("About me");
  screen.getByText("We don't know anything about them yet");
});
