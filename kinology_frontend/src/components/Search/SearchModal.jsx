import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  object,
  string,
  array,
  literal,
  union,
  minValue,
  maxValue,
  number,
  maxLength,
  optional,
  pipe,
} from "valibot";
import PaginationController from "../Pagination/PaginationController";
import { Button } from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import SearchForm from "./SearchForm";
import useMovieSearch from "../../hooks/useMovieSearch";
import PropTypes from "prop-types";

const modalOpenStyle = {
  backgroundColor: "#609b76",
  "&:hover": { backgroundColor: "#00532f" },
  marginLeft: "1.15em",
  marginRight: "1.15em",
};

const sheetStyle = {
  width: 650,
  borderRadius: "md",
  p: 3,
  boxShadow: "lg",
  bgcolor: "#F6E9B2",
};

const newSearchStyle = {
  margin: 2,
  backgroundColor: "#F7E382",
  color: "#00532f",
  "&:hover": { backgroundColor: "#BDAC4E" },
};

const searchQuerySchema = object({
  genresSelect: optional(
    array(
      object({
        label: string("Genre label should be a string"),
        value: number("Genre value should be a number"),
      })
    )
  ),
  year: union([
    pipe(
      string(),
      minValue("1874", "Movies can not be shot before 1874"),
      maxValue(
        `${new Date().getFullYear()}`,
        "Can not search for movies shot after current year"
      )
    ),
    literal(""),
  ]),
  ratingUpper: pipe(
    number("Rating should be a number"),
    minValue(0, "Rating can not be lower than 0"),
    maxValue(10, "Rating can not be higher than 10")
  ),
  ratingLower: pipe(
    number("Rating should be a number"),
    minValue(0, "Rating can not be lower than 0"),
    maxValue(11, "Rating can not be higher than 10")
  ),
  country: pipe(
    string("Country should be a string"),
    maxLength(100, "Country name can not be this long")
  ),
  director: string("Director should be a string"),
});

// search modal hosts so much of the search form logic because handle new search button is also in this component and separating the logic proved to be too difficult at the moment. Then there is pagination as well...I would appreciate if you could give me some pointers as to how to fix this.
const SearchModal = ({ setMovies }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: valibotResolver(searchQuerySchema),
    defaultValues: {
      genresSelect: [],
      director: "",
      year: "",
      ratingLower: 0,
      ratingUpper: 10,
      country: "",
    },
  });

  const {
    handleKeyDown,
    handleNewSearch,
    searchForMovies,
    firstSearchData,
    page,
    totalPages,
    open,
    actor,
    actors,
    setActor,
    setActors,
    setPage,
    setOpen,
  } = useMovieSearch(setMovies, reset);

  return (
    <div className="searchPage">
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={modalOpenStyle}
      >
        Open Search
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet variant="outlined" sx={sheetStyle}>
          <ModalClose variant="plain" sx={{ marginLeft: 1 }} />
          <SearchForm
            control={control}
            handleKeyDown={handleKeyDown}
            isSubmitting={isSubmitting}
            actor={actor}
            actors={actors}
            setActor={setActor}
            setActors={setActors}
            handleSubmit={handleSubmit((data) => searchForMovies(data, 1))}
          />
        </Sheet>
      </Modal>
      <Button onClick={handleNewSearch} variant="contained" sx={newSearchStyle}>
        clear search
      </Button>
      {/* pagination controller changes the page and makes a request to search for movies with the next page number */}
      <PaginationController
        pages={totalPages}
        page={page}
        setPage={setPage}
        pageChange={(event, value) => searchForMovies(firstSearchData, value)}
      />
    </div>
  );
};

export default SearchModal;

SearchModal.propTypes = {
  setMovies: PropTypes.func.isRequired,
};
