import { Link } from "react-router-dom";
import { useRef } from "react";
import Togglable from "./Togglable";
import CommentForm from "./CommentForm";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const CommentList = ({ comments, onEdit, onDelete }) => {
  console.log(comments);

  const editCommentRef = useRef();

  const editComment = (content, commentId) => {
    editCommentRef.current.toggleVisibility();
    onEdit(commentId, content);
  };

  //   const updateComment = async (commentId, comment) => {
  //     const updatedComment = await commentsService.updateProfileComment(
  //       id,
  //       commentId,
  //       currentUser,
  //       comment
  //     );
  //     setComments(
  //       comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
  //     );
  //   };

  const editForm = (commentId) => {
    return (
      <Togglable buttonLabel="edit comment" ref={editCommentRef}>
        <CommentForm commentAction={editComment} commentId={commentId} />
      </Togglable>
    );
  };

  return (
    <List sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <ListItem
            alignItems="flex-start"
            component={Link}
            to={`/users/${comment.author.id}`}
          >
            <ListItemAvatar>
              <Avatar alt={comment.author.name} src={comment.author.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={comment.author.name}
              secondary={comment.content}
            />
          </ListItem>
          {/* <Button
            variant="contained"
            size="small"
            sx={{ marginRight: 2 }}
            onClick={openEditModal}
          >
            Edit comment
          </Button> */}
          {editForm(comment.id)}
          <Button
            variant="contained"
            size="small"
            onClick={() => onDelete(comment.id)}
            color="error"
          >
            Delete comment
          </Button>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
};

// const updateComment = async (commentId, comment) => {
//     const updatedComment = await commentsService.updateProfileComment(
//       id,
//       commentId,
//       currentUser,
//       comment
//     );
//     setComments(
//       comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
//     );
//   };

export default CommentList;
