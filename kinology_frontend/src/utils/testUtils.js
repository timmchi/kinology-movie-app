import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

export const testSetup = (element) => {
  return {
    user: userEvent.setup(),
    ...render(element),
  };
};
