import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const CommentList = ({ comments }) => {
  console.log(comments);
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
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
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
};

export default CommentList;
