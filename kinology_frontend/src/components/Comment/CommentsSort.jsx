import SortIcon from "@mui/icons-material/Sort";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const CommentsSort = ({ onSort, sortDesc }) => {
  return (
    <div className="sort-comments">
      <Button sx={{ color: "#bdac4e" }}>
        <SortIcon onClick={onSort} />
      </Button>
      <Typography sx={{ paddingTop: "0.5em" }}>
        Sorting by: {sortDesc ? "Newest first" : "Oldest first"}
      </Typography>
    </div>
  );
};

export default CommentsSort;

CommentsSort.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortDesc: PropTypes.bool.isRequired,
};
