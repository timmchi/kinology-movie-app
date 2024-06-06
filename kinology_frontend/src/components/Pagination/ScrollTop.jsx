import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fab from "@mui/material/Fab";
import PropTypes from "prop-types";

const ScrollTop = ({ goToSearch }) => {
  return (
    <Fab
      onClick={goToSearch}
      sx={{ opacity: "0.7", marginLeft: "1em", marginBottom: "1em" }}
    >
      <ArrowUpwardIcon />
    </Fab>
  );
};

export default ScrollTop;

ScrollTop.propTypes = {
  goToSearch: PropTypes.func,
};
