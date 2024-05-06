const LogOut = () => {
  const handleLogout = () =>
    window.localStorage.removeItem("loggedKinologyUser");

  return (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  );
};

export default LogOut;
