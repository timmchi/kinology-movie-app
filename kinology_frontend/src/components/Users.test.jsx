import { expect, test } from "vitest";
import { testSetup } from "../utils/testUtils";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

const exampleUsers = [
  {
    id: 1,
    name: "User 1",
    avatarUrl: "https://example.com/avatar1.jpg",
  },
  {
    id: 2,
    name: "User 2",
    avatarUrl: "https://example.com/avatar2.jpg",
  },
  {
    id: 3,
    name: "User 3",
    avatarUrl: "https://example.com/avatar3.jpg",
  },
];
