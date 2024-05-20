const LogOut = ({ handleLogout }) => {
  return (
    <form onSubmit={handleLogout}>
      <button type="submit">log out</button>
    </form>
  );
};

export default LogOut;
