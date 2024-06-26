import { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useUserValue } from "../../contexts/UserContext";
import PropTypes from "prop-types";
import usersService from "../../services/users";
import { Typography } from "@mui/material";

const CommentView = ({ comment, editForm, onDelete }) => {
  const [avatar, setAvatar] = useState("");
  const currentUser = useUserValue();

  useEffect(() => {
    const fetchAvatar = async () => {
      const commentAuthorAvatar = await usersService.getUserAvatar(
        comment.author?.id
      );
      setAvatar(commentAuthorAvatar);
    };
    fetchAvatar();
  }, [comment.author?.id]);

  return (
    <div className="singleComment">
      <ListItem
        alignItems="flex-start"
        component={Link}
        to={comment.author ? `/users/${comment.author?.id}` : "/users"}
      >
        <ListItemAvatar>
          <Avatar alt={comment.author?.name} src={avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.author?.name ?? "Deleted user"}
          secondary={comment.content}
          sx={{ color: "#F7E382" }}
          secondaryTypographyProps={{ color: "white" }}
        />
        <Typography>
          {comment.createdAt
            ? new Date(comment.createdAt).toLocaleString()
            : ""}
        </Typography>
      </ListItem>
      <div className="commentButtons">
        {currentUser && ( // logged in user can see edit/delete buttons based on if he is the comment author/profile owner. Delete is visible to profile owner and comment author, edit only visible to comment author
          <>
            {currentUser.username === comment.author?.username && (
              <>
                {editForm(comment.id, comment.author?.id)}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onDelete(comment.id, comment.author?.id)}
                  sx={{
                    backgroundColor: "#9b000a",
                    "&:hover": { backgroundColor: "#730000" },
                    marginLeft: 2,
                    alignSelf: "start",
                  }}
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
                  sx={{
                    backgroundColor: "#9b000a",
                    "&:hover": { backgroundColor: "#730000" },
                  }}
                >
                  Delete comment
                </Button>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentView;

CommentView.propTypes = {
  comment: PropTypes.object,
  editForm: PropTypes.func,
  onDelete: PropTypes.func,
};
