const LogOut = () => {
  const handleLogout = (event) => {
    console.log("logging out...");
    window.localStorage.removeItem("loggedKinologyUser");
    window.location.reload();
  };

  return (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  );
};

export default LogOut;
