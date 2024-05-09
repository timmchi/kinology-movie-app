import { useState } from "react";

const CommentForm = ({ createComment }) => {
  const [content, setContent] = useState("");

  const submitComment = (event) => {
    event.preventDefault();
    createComment(content);
    setContent("");
  };

  return (
    <div>
      <p>comment form</p>
      <form onSubmit={submitComment}>
        <div>
          content
          <input
            onChange={({ target }) => setContent(target.value)}
            placeholder="Your comment..."
            value={content}
          />
        </div>
        <button type="submit">submit comment</button>
      </form>
    </div>
  );
};

export default CommentForm;
