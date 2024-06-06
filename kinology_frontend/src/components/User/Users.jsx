import List from "@mui/material/List";
import UserSingleListView from "./UserSingleListView";
import PropTypes from "prop-types";

const Users = ({ users }) => {
  if (!users) return <>no users yet</>;

  // users state is not being updated when new user gets added, but is it worth it creating a state in this component? Users list should only be available after logging in anyway, after which the users list IS updated..

  return (
    <div>
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
