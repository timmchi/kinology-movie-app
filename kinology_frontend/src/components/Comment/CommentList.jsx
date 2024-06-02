import { useRef } from "react";
import Togglable from "../Togglable/Togglable";
import CommentForm from "./CommentForm";
import CommentView from "../CommentView";
import List from "@mui/material/List";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const CommentList = ({ comments, onEdit, onDelete, currentUser }) => {
  const editCommentRef = useRef();

  if (!comments || comments.length === 0)
    return (
      <Typography variant="h5" sx={{ paddingTop: 2 }}>
        No comments yet...
      </Typography>
    );

  const editComment = (content, commentId, authorId) => {
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
          label={"Edit your comment"}
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

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  currentUser: PropTypes.object,
};
