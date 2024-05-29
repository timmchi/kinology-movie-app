import { useState } from "react";
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
} from "valibot";
import PaginationController from "./PaginationController";
import { Button } from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import SearchForm from "./SearchForm";
import moviesService from "../services/movies";

const createOption = (label) => ({
  label,
  value: label,
});

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
    string([
      minValue("1874", "Movies can not be shot before 1874"),
      maxValue(
        `${new Date().getFullYear()}`,
        "Can not search for movies shot after current year"
      ),
    ]),
    literal(""),
  ]),
  ratingUpper: number("Rating should be a number", [
    minValue(0, "Rating can not be lower than 0"),
    maxValue(10, "Rating can not be higher than 10"),
  ]),
  ratingLower: number("Rating should be a number", [
    minValue(0, "Rating can not be lower than 0"),
    maxValue(11, "Rating can not be higher than 10"),
  ]),
  country: string("Country should be a string", [
    maxLength(100, "Country name can not be this long"),
  ]),
  director: string("Director should be a string"),
});

const transformData = (data, actors, pageValue) => {
  const { genresSelect, director, year, ratingUpper, ratingLower, country } =
    data;

  const actorsQuery = actors.map((actor) => actor.value);
  const genres = genresSelect
    ? genresSelect?.map((genreOption) => `${genreOption.value}`)
    : [];

  const transformedObject = {
    genres,
    director,
    year,
    ratingUpper: Number(ratingUpper),
    ratingLower: Number(ratingLower),
    actors: actorsQuery,
    country,
    page: pageValue,
  };

  return transformedObject;
};

const SearchModal = ({ setMovies }) => {
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [firstSearchData, setFirstSearchData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
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

  const searchForMovies = async (data, pageValue) => {
    setFirstSearchData(data);
    const dataObject = transformData(data, actors, pageValue);
    const { movieToFrontObjectArray: movies, totalPages: totalPageNumber } =
      await moviesService.search(dataObject);
    setTotalPages(totalPageNumber);
    setMovies(movies);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!actor) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setActors((prev) => [...prev, createOption(actor)]);
        setActor("");
        event.preventDefault();
    }
  };

  const handleNewSearch = () => {
    reset();
    setActors([]);
    setPage(1);
    setTotalPages(-1);
    setMovies([]);
  };

  return (
    <div className="searchPage">
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#609b76",
          "&:hover": { backgroundColor: "#00532f" },
          marginLeft: "1.15em",
          marginRight: "1.15em",
        }}
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
        <Sheet
          variant="outlined"
          sx={{
            width: 650,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            bgcolor: "#F6E9B2",
          }}
        >
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
      <Button
        onClick={handleNewSearch}
        variant="contained"
        sx={{
          margin: 2,
          backgroundColor: "#F7E382",
          color: "#00532f",
          "&:hover": { backgroundColor: "#BDAC4E" },
        }}
      >
        clear search
      </Button>
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
