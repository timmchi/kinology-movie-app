import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

const createOption = (label) => ({
  label,
  value: label,
});

const parseIntoSearchParams = (savedData) => {
  const parsedData = {
    genresSelect: savedData.genres
      ? savedData.genres.split(",").map((g) => ({ label: g, value: g }))
      : [],
    director: savedData.director || "",
    year: savedData.year || "",
    ratingUpper: Number(savedData.ratingUpper || 10),
    ratingLower: Number(savedData.ratingLower || 0),
    country: savedData.country || "",
  };

  const parsedActors = savedData.actors
    ? savedData.actors.split(",").map((a) => createOption(a))
    : [];

  return { parsedData, parsedActors };
};

const useMovieSearch = (setMovies, reset) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [firstSearchData, setFirstSearchData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedData = Object.fromEntries([...searchParams]);

    if (Object.keys(savedData).length > 0) {
      const { parsedData, parsedActors } = parseIntoSearchParams(savedData);

      setFirstSearchData(parsedData);
      setActors(parsedActors);
      setPage(Number(savedData.page || 1));

      searchForMovies(parsedData, Number(savedData.page || 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const searchForMovies = async (data, pageValue) => {
    setFirstSearchData(data);
    const dataObject = transformData(data, actors, pageValue);

    setSearchParams({
      ...dataObject,
      genres: dataObject.genres.join(","),
      actors: dataObject.actors.join(","),
      page: pageValue,
    });

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
    setSearchParams({});
  };

  return {
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
  };
};

export default useMovieSearch;
