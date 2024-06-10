import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const logOutButtonStyle = {
  textAlign: "center",
  color: "#f7e382",
  fontSize: "1rem",
  backgroundColor: "rgba(155, 0, 10, 0.4)",
  borderRadius: 2.5,
  paddingBottom: 1,
  marginLeft: 2,
  "&:hover": { backgroundColor: "rgba(155, 0, 10, 0.8)" },
};

const LogOut = ({ handleLogout }) => {
  return (
    <Button
      onClick={handleLogout}
      sx={logOutButtonStyle}
      className="nav-link"
      data-testid="logout-button"
    >
      log out
    </Button>
  );
};

export default LogOut;

LogOut.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
