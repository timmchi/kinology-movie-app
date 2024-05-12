import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import PaginationController from "./PaginationController";
import genreOptions from "../data/genres";

import SearchIcon from "@mui/icons-material/Search";
import moviesService from "../services/movies";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const SearchBar = ({ setMovies }) => {
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [firstSearchData, setFirstSearchData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    // resolver: valibotResolver(LoginSchema),
    defaultValues: { genresSelect: {} },
  });

  const onSubmit = (data) => console.log(data, actors);

  const searchForMovies = async (data, pageValue) => {
    console.log(data);

    // TODO - refactor this: create a function that parses the data into suitable shape
    const actorsQuery = actors.map((actor) => actor.value);
    const { genresSelect, director, year, ratingUpper, ratingLower, country } =
      data;
    const genres = genresSelect.map((genreOption) => `${genreOption.value}`);
    setFirstSearchData(data);
    const { movieToFrontObjectArray: movies, totalPages: totalPageNumber } =
      await moviesService.search({
        genres,
        director,
        year,
        ratingUpper: Number(ratingUpper),
        ratingLower: Number(ratingLower),
        actors: actorsQuery,
        country,
        page: pageValue,
      });
    console.log(movies);
    console.log("page number in searchbar", totalPageNumber);
    setTotalPages(totalPageNumber);
    setMovies(movies);
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
    <div>
      <button onClick={handleNewSearch}>new search</button>
      <form
        onSubmit={handleSubmit((data) => searchForMovies(data, 1))}
        className="searchBar"
      >
        <div className="genres">
          <Controller
            name="genresSelect"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderWidth: 0,
                    borderRadius: 10,
                  }),
                }}
                options={genreOptions}
                isMulti
                placeholder="Select genres"
              />
            )}
          />
        </div>
        <div className="director">
          <p>director</p>
          <input {...register("director")} type="text" className="bar-input" />
        </div>
        <div className="year">
          <p>year</p>
          <input {...register("year")} className="bar-input" />
        </div>
        <div className="rating">
          <p>Rating range</p>
          <input
            {...register("ratingLower")}
            placeholder="Lower threshhold"
            type="number"
            className="bar-input"
            defaultValue={1}
          />
          <input
            {...register("ratingUpper")}
            placeholder="Upper threshold"
            type="number"
            className="bar-input"
            defaultValue={10}
          />
        </div>
        <div className="actors">
          <Controller
            name="actorsSelect"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                components={components}
                options={genreOptions}
                inputValue={actor}
                isMulti
                isClearable
                menuIsOpen={false}
                placeholder="Type in actor and press enter"
                onChange={(newActor) => setActors(newActor)}
                onInputChange={(newActor) => setActor(newActor)}
                onKeyDown={handleKeyDown}
                value={actors}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderWidth: 0,
                  }),
                }}
              />
            )}
          />
        </div>
        <div className="country">
          <p>country</p>
          <input {...register("country")} className="bar-input" />
          <button type="submit">
            <SearchIcon />
          </button>
        </div>
      </form>
      <PaginationController
        pages={totalPages}
        page={page}
        setPage={setPage}
        pageChange={(event, value) => searchForMovies(firstSearchData, value)}
      />
    </div>
  );
};

export default SearchBar;
