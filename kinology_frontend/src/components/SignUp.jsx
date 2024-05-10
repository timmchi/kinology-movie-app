import { useNavigate } from "react-router-dom";
import { useState } from "react";
import signUpService from "../services/signup";

// repeating the password field will need to be implemented along with some validation

const SignUp = ({ user, setUsers, users }) => {
  const navigate = useNavigate();
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
    } catch (exception) {
      console.log("something went wrong in signup");
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
          />
        </div>
        <div>
          name:{" "}
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            name="Name"
          />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            name="Password"
          />
        </div>
        <button type="submit">sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
