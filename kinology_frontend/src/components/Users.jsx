import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import UserSingleListView from "./UserSingleListView";
import PropTypes from "prop-types";

// TODO - fix the state so that on profile update user information in user list changes
const Users = ({ users }) => {
  console.log(users);
  if (!users) return <>no users yet</>;

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
            <UserSingleListView user={user} />
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </div>
  );
};

export default Users;

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
