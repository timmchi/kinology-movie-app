import { useState } from "react";

const CommentForm = ({ commentAction, commentId }) => {
  const [content, setContent] = useState("");

  const submitComment = (event) => {
    event.preventDefault();
    commentAction(content, commentId);
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
