import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fab from "@mui/material/Fab";
import PropTypes from "prop-types";

// goToSearch uses ref to scroll to the search component which also has pagination. This is a bit of hack required because pagination component is intertwined with movie search and it was difficult to figure out how to move it to the bottom of the screen as well.
const ScrollTop = ({ goToSearch }) => {
  return (
    <div className="scroll-top-button">
      <Fab
        onClick={goToSearch}
        sx={{ opacity: "0.7", marginLeft: "1em", marginBottom: "1em" }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </div>
  );
};

export default ScrollTop;

ScrollTop.propTypes = {
  goToSearch: PropTypes.func,
};
