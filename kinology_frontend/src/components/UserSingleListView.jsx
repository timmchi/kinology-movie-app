import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import usersService from "../services/users";

const UserSingleListView = ({ user }) => {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      const userAvatar = await usersService.getUserAvatar(user.id);
      setAvatar(userAvatar);
    };
    fetchAvatar();
  }, [user.id]);

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        backgroundColor: "#79C094",
        color: "#fff",
        borderRadius: 10,
      }}
      component={Link}
      to={`/users/${user.id}`}
    >
      <ListItemAvatar>
        <Avatar alt={user?.name} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={
          user.biography !== ""
            ? user.biography
            : "We don't know much about them yet..."
        }
      />
    </ListItem>
  );
};

export default UserSingleListView;
