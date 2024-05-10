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

const CommentList = ({ comments, onEdit, onDelete, currentUser, authorId }) => {
  console.log(comments);

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

  if (comments.length === 0) return "no comments yet...";
  return (
    <List sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <ListItem
            alignItems="flex-start"
            component={Link}
            to={comment.author ? `/users/${comment.author?.id}` : "/users"}
          >
            <ListItemAvatar>
              <Avatar alt={comment.author?.name} src={comment.author?.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={comment.author?.name ?? "Deleted user"}
              secondary={comment.content}
            />
          </ListItem>
          {currentUser && (
            <>
              {currentUser.username === comment.author?.username && (
                <>
                  {editForm(comment.id, comment.author?.id)}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onDelete(comment.id, comment.author?.id)}
                    color="error"
                  >
                    Delete comment
                  </Button>
                </>
              )}
              {currentUser.username === comment.receiver?.username &&
                currentUser.username !== comment.author?.username && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onDelete(comment.id, comment.author?.id)}
                    color="error"
                  >
                    Delete comment
                  </Button>
                )}
            </>
          )}

          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
};

export default CommentList;
