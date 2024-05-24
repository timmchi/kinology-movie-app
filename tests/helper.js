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

const editComment = async (page, editLocator, newComment) => {
  const editCommentButton = page.getByRole("button", {
    name: "edit comment",
  });
  await editCommentButton.click();

  const editCommentInput = page
    .locator("ul")
    .filter({ hasText: editLocator })
    .getByPlaceholder("comment");

  const submitEditButton = page
    .locator("ul")
    .filter({ hasText: editLocator })
    .locator("#comment-button");

  await editCommentInput.fill(newComment);
  await submitEditButton.click();
};

export { loginWith, registerWith, postComment, deleteComment, editComment };
