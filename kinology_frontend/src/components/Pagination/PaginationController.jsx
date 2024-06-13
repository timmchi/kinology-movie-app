import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

const paginationStyles = {
  button: { color: "white" },
  ul: {
    "& .MuiPaginationItem-root": {
      color: "white",
      "&.Mui-selected": {
        background: "#609b76",
      },
      "&:hover": {
        backgroundColor: "rgba(96, 155, 118, 0.5)",
      },
    },
  },
};

const PaginationController = ({ pages, page, setPage, pageChange }) => {
  const handleChange = async (event, value) => {
    setPage(value);
    pageChange(event, value);
  };

  if (pages === -1) return "";

  // limit of 10 pages is arbitrary and could be changed to more. I made this choice because I thought 200 movies would most likely be enough to choose something to watch.
  return (
    <Stack spacing={2}>
      <Pagination
        count={pages > 10 ? 10 : pages}
        page={page}
        onChange={handleChange}
        sx={paginationStyles}
      />
    </Stack>
  );
};

export default PaginationController;

PaginationController.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  pageChange: PropTypes.func.isRequired,
};
