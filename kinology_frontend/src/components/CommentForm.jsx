import { useState } from "react";

const CommentForm = ({ commentAction, commentId, authorId }) => {
  const [content, setContent] = useState("");

  const submitComment = (event) => {
    event.preventDefault();
    console.log("authorId in submitComment in CommentForm", authorId);
    commentAction(content, commentId, authorId);
    setContent("");
  };

  return (
    <div>
      <p>comment form</p>
      <form onSubmit={submitComment}>
        <div>
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
