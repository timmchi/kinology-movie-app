import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const CommentList = ({ comments, onEdit, onDelete }) => {
  console.log(comments);
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
          <Button
            variant="contained"
            size="small"
            sx={{ marginRight: 2 }}
            onClick={onEdit}
          >
            Edit comment
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onDelete}
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

export default CommentList;
