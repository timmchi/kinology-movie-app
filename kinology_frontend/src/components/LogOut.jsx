import Button from "@mui/material/Button";

const LogOut = ({ handleLogout }) => {
  return (
    <Button
      onClick={handleLogout}
      sx={{
        textAlign: "center",
        color: "#f7e382",
        fontSize: "1rem",
        backgroundColor: "rgba(155, 0, 10, 0.4)",
        borderRadius: 2.5,
        paddingBottom: 1,
        marginLeft: 2,
        "&:hover": { backgroundColor: "rgba(155, 0, 10, 0.8)" },
      }}
      className="nav-link"
      data-testid="logout-button"
    >
      log out
    </Button>
  );
};

export default LogOut;
