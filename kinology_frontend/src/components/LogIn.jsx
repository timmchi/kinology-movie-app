import { useNavigate } from "react-router-dom";

const LogIn = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
  user,
}) => {
  const navigate = useNavigate();

  // this needs to be changed
  if (user) navigate("/");
  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          username:{" "}
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            name="Username"
          />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            name="Password"
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  );
};

export default LogIn;
