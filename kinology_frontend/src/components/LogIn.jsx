const LogIn = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => {
  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          username:{" "}
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  );
};

export default LogIn;
