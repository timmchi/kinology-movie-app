import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import signUpService from "../services/signup";

// repeating the password field will need to be implemented along with some validation

const SignUp = ({ user, setUsers, users }) => {
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    console.log("signing up with", username, password, name);
    try {
      const user = await signUpService.signUp({ username, password, name });
      console.log(user);
      setUsername("");
      setName("");
      setPassword("");
      setUsers(users.concat(user));
      dispatch({
        type: "SHOW",
        payload: {
          message: "Sign up was successful, please log in",
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      console.log("something went wrong in signup");
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when signing up",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  // this needs to be changed
  if (user) navigate("/");
  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <div>
          username:{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            name="Username"
            autoComplete="username"
          />
        </div>
        <div>
          name:{" "}
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            name="Name"
            autoComplete="name"
          />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            name="Password"
            autoComplete="new-password"
          />
        </div>
        <button type="submit">sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
