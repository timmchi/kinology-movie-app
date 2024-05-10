import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PaginationController = ({ pages, page, setPage }) => {
  //   const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  if (pages === -1) return "";

  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination
        count={pages > 10 ? 10 : pages}
        page={page}
        onChange={handleChange}
      />
    </Stack>
  );
};

export default PaginationController;
