import { useRef, useState } from "react";
import Togglable from "../Togglable/Togglable";
import CommentForm from "./CommentForm";
import CommentView from "./CommentView";
import List from "@mui/material/List";
import { Typography } from "@mui/material";
import CommentsSort from "./CommentsSort";
import PropTypes from "prop-types";

const sortComments = (comments, sortDesc) => {
  const sortedComments = comments?.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortDesc ? dateB - dateA : dateA - dateB;
  });

  return sortedComments;
};

const CommentList = ({ comments, onEdit, onDelete }) => {
  const editCommentRef = useRef();
  const [sortDesc, setSortDesc] = useState(true);

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

  const sortedComments = sortComments(comments, sortDesc);

  return (
    <>
      <CommentsSort sortDesc={sortDesc} onSort={() => setSortDesc(!sortDesc)} />
      <List sx={{ width: "100%", maxWidth: 600, backgroundColor: "#397453" }}>
        {sortedComments.map((comment) => (
          <div key={comment.id}>
            <CommentView
              comment={comment}
              editForm={editForm}
              onDelete={onDelete}
            />
          </div>
        ))}
      </List>
    </>
  );
};

export default CommentList;

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
