import { useState } from "react";
import moviesService from "../services/movies";

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

const useMovieSearch = (setMovies) => {
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [firstSearchData, setFirstSearchData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [open, setOpen] = useState(false);

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

  const handleNewSearch = (reset) => {
    reset();
    setActors([]);
    setPage(1);
    setTotalPages(-1);
    setMovies([]);
  };
};
