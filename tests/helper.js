const { test, describe, expect, beforeEach } = require("playwright/test");

const loginWith = async (page, username, password) => {
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
};

const registerWith = async (
  page,
  username,
  name,
  email,
  password,
  passwordConfirm
) => {
  await page.getByRole("link", { name: "Sign Up" }).click();
  await page.getByTestId("username").fill(username);
  await page.getByTestId("email").fill(email);
  await page.getByTestId("name").fill(name);
  await page.getByTestId("password").fill(password);
  await page.getByTestId("password-confirm").fill(passwordConfirm);

  const signupButton = page.getByRole("button", { name: "Sign Up" });
  await signupButton.click();
};

const postComment = async (page, content) => {
  const commentInput = page.getByPlaceholder("comment");
  const submitCommentButton = page.getByRole("button", {
    name: "Submit comment",
  });

  await commentInput.fill(content);
  await submitCommentButton.click();
};

const deleteComment = async (page) => {
  page.on("dialog", (dialog) => dialog.accept());

  const deleteCommentButton = page.getByRole("button", {
    name: "delete comment",
  });
  await deleteCommentButton.click();
};

const movieButtonsVisible = async (page) => {
  const watchButton = page.getByRole("button", { name: "Watch" });
  await expect(watchButton).toBeVisible();

  const favoriteButton = page.getByRole("button", { name: "Favorite" });
  await expect(favoriteButton).toBeVisible();

  const seenButton = page.getByRole("button", { name: "Seen" });
  await expect(seenButton).toBeVisible();
};

const movieButtonsNotVisible = async (page) => {
  const watchButton = page.getByRole("button", { name: "Watch" });
  await expect(watchButton).not.toBeVisible();

  const favoriteButton = page.getByRole("button", { name: "Favorite" });
  await expect(favoriteButton).not.toBeVisible();

  const seenButton = page.getByRole("button", { name: "Seen" });
  await expect(seenButton).not.toBeVisible();
};

const logOut = async (page) => {
  const logoutButton = page.getByText("log out");
  await logoutButton.click();
};

const visitUserPage = async (page, userName) => {
  const usersLink = page.getByRole("link", { name: "Users" });
  await usersLink.click();

  const userPageLink = page.getByRole("link", { name: userName });
  await userPageLink.click();
};

const heroPageVisible = async (page) => {
  const welcomeHeader = page.getByRole("heading", {
    name: "Welcome to Kinology",
  });
  const welcomeMessage = page.getByText("Choosing a movie made");

  const registerMessage = page.getByText("Too many good options to");

  await expect(registerMessage).toBeVisible();
  await expect(welcomeMessage).toBeVisible();
  await expect(welcomeHeader).toBeVisible();
};

const openCommentForm = async (page) => {
  const openCommentButton = page.getByRole("button", {
    name: "leave a comment",
  });
  await openCommentButton.click();
};

const clickButton = async (page, buttonName) => {
  const button = page.getByRole("button", {
    name: buttonName,
    exact: true,
  });

  await button.click();
};

const clickLink = async (page, linkName) => {
  const link = page.getByRole("link", { name: linkName });
  await link.click();
};

export {
  loginWith,
  registerWith,
  postComment,
  deleteComment,
  movieButtonsVisible,
  movieButtonsNotVisible,
  logOut,
  visitUserPage,
  heroPageVisible,
  openCommentForm,
  clickButton,
  clickLink,
};
