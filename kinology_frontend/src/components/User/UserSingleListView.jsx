import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import usersService from "../../services/users";
import PropTypes from "prop-types";

const listItemStyle = {
  backgroundColor: "#79C094",
  color: "#fff",
  borderRadius: 10,
  marginBottom: 1,
  border: "3px solid #bdac4e",
  boxShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
};

const primaryTypographyProp = {
  style: {
    color: "#bdac4e",
    textShadow: "0.5px 0.5px 2px rgba(13, 4, 2, 0.8)",
    fontSize: 18,
    fontWeight: "bold",
  },
};

const secondaryTypographyProp = {
  style: {
    color: "white",
    textShadow: "0.5px 0.5px 2px rgba(13, 4, 2, 1)",
  },
};

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
      sx={listItemStyle}
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
        primaryTypographyProps={primaryTypographyProp}
        secondaryTypographyProps={secondaryTypographyProp}
      />
    </ListItem>
  );
};

export default UserSingleListView;

UserSingleListView.propTypes = {
  user: PropTypes.object.isRequired,
};
