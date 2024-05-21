import { useRef } from "react";
import Togglable from "./Togglable";
import CommentForm from "./CommentForm";
import CommentView from "./CommentView";
import List from "@mui/material/List";

const CommentList = ({ comments, onEdit, onDelete, currentUser }) => {
  console.log(comments);
  if (!comments || comments.length === 0) return "no comments yet...";

  const editCommentRef = useRef();

  const editComment = (content, commentId, authorId) => {
    console.log("authorId in editComment in CommentList");
    editCommentRef.current.toggleVisibility();
    onEdit(commentId, content, authorId);
  };

  const editForm = (commentId, authorId) => {
    return (
      <Togglable buttonLabel="edit comment" ref={editCommentRef}>
        <CommentForm
          commentAction={editComment}
          commentId={commentId}
          authorId={authorId}
        />
      </Togglable>
    );
  };

  return (
    <List sx={{ width: "100%", maxWidth: 600, backgroundColor: "#397453" }}>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <CommentView
            comment={comment}
            currentUser={currentUser}
            editForm={editForm}
            onDelete={onDelete}
          />
        </div>
      ))}
    </List>
  );
};

export default CommentList;
