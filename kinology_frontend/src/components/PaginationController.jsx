import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PaginationController = ({ pages, page, setPage, pageChange }) => {
  const handleChange = async (event, value) => {
    setPage(value);
    pageChange(event, value);
  };

  if (pages === -1) return "";

  return (
    <Stack spacing={2}>
      {/* <Typography>Page: {page}</Typography> */}
      <Pagination
        count={pages > 10 ? 10 : pages}
        page={page}
        onChange={handleChange}
        sx={{ backgroundColor: "#BDAC4E" }}
      />
    </Stack>
  );
};

export default PaginationController;
