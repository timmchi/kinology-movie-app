import { useState, useEffect } from "react";
import usersService from "../services/users";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await usersService.getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);
  return (
    <div>
      <h1>users</h1>
      {users?.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
};

export default Users;
