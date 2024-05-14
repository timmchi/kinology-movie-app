import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

// TODO - fix the state so that on profile update user information in user list changes
const Users = ({ users }) => {
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
          <div key={user.id}>
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
              <ListItemText
                primary={user.name}
                secondary="Favorite movie: Godfather II"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </div>
  );
};

export default Users;
