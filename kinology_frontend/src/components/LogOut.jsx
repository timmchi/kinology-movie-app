import Button from "@mui/material/Button";

const LogOut = ({ handleLogout }) => {
  return (
    <Button
      onClick={handleLogout}
      sx={{ textAlign: "center", color: "#f7e382", fontSize: "1rem" }}
      className="nav-link"
    >
      log out
    </Button>
  );
};

export default LogOut;
