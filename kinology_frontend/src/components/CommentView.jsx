import { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import usersService from "../services/users";

const CommentView = ({ comment, currentUser, editForm, onDelete }) => {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      const commentAuthorAvatar = await usersService.getUserAvatar(
        comment.author?.id
      );
      setAvatar(commentAuthorAvatar);
    };
    fetchAvatar();
  }, [comment.author?.id]);

  console.log(comment.author.name);
  return (
    <div>
      <ListItem
        alignItems="flex-start"
        component={Link}
        to={comment.author ? `/users/${comment.author?.id}` : "/users"}
      >
        <ListItemAvatar>
          <Avatar alt={comment.author?.name} src={avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.author.name ?? "Deleted user"}
          secondary={comment.content}
          sx={{ color: "black" }}
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
    </div>
  );
};

export default CommentView;
