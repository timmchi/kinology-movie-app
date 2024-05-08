import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import usersService from "../services/users";

const User = () => {
  let { id } = useParams();
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await usersService.getUser(id);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [id]);

  console.log(user);
  return (
    <div>
      <h1>User</h1>
      <p>{user.name}</p>
    </div>
  );
};

export default User;
