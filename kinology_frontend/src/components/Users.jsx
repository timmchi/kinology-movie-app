import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usersService from "../services/users";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const Users = ({ users, setUsers }) => {
  console.log(users);
  return (
    <div>
      <h1>users</h1>
      <List
        sx={{
          width: "100%",
          backgroundColor: "#2F764F",
          padding: 5,
        }}
        className="userList"
      >
        {users?.map((user) => (
          <ListItem
            alignItems="flex-start"
            key={user.id}
            sx={{
              backgroundColor: "#79C094",
              color: "#fff",
              borderRadius: 10,
            }}
            component={Link}
            to={`/users/${user.id}`}
          >
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar}></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary="Favorite movie: Godfather II"
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Users;
