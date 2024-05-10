import { useState } from "react";
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
  const [genres, setGenres] = useState([]);
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [ratingUpper, setRatingUpper] = useState(10);
  const [ratingLower, setRatingLower] = useState(0);
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  //   const [newSearch, setNewSearch] = useState(false);

  const searchForMovies = async (e) => {
    e.preventDefault();
    const actorsQuery = actors.map((actor) => actor.value);
    const { movieToFrontObjectArray: movies, totalPages: totalPageNumber } =
      await moviesService.search({
        genres,
        director,
        year,
        ratingUpper,
        ratingLower,
        actors: actorsQuery,
        country,
        page,
      });
    console.log(movies);
    console.log("page number in searchbar", totalPageNumber);
    setTotalPages(totalPageNumber);
    setMovies(movies);

    // if (newSearch) {
    //   setDirector("");
    //   setYear("");
    //   setRatingLower(0);
    //   setRatingUpper(10);
    //   setActors([]);
    //   setCountry("");
    //   setPage();
    // }
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

  const onGenresChange = (e) => {
    const updatedGenres = e.map((genre) => genre.value);
    setGenres(updatedGenres);
  };

  const handleNewSearch = () => {
    setDirector("");
    setYear("");
    setRatingLower(0);
    setRatingUpper(10);
    setActors([]);
    setCountry("");
    setPage(1);
    setTotalPages(-1);
    setMovies([]);
  };

  return (
    <div>
      <h1>search bar</h1>
      <button onClick={handleNewSearch}>new search</button>
      <form onSubmit={searchForMovies} className="searchBar">
        {/* <div className="container"> */}
        <div className="genres">
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderWidth: 0,
                borderRadius: 10,
              }),
            }}
            closeMenuOnSelect={false}
            isMulti
            options={genreOptions}
            placeholder="Select genres"
            onChange={onGenresChange}
          />
        </div>
        <div className="director">
          <p>director</p>
          <input
            type="text"
            className="bar-input"
            value={director}
            onChange={(event) => setDirector(event.target.value)}
            placeholder="Director"
            data-testid="director"
          />
        </div>
        <div className="year">
          <p>year</p>
          <input
            type="number"
            className="bar-input"
            min="1888"
            max={new Date().getFullYear()}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="Year"
            data-testid="year"
          />
        </div>
        <div className="rating">
          <p>Lowest to highest rating</p>
          <input
            type="number"
            className="bar-input"
            min="0"
            max="10"
            value={ratingLower}
            onChange={(event) => setRatingLower(event.target.value)}
            placeholder="Lower boundary"
            data-testid="ratingLow"
          />
          <input
            type="number"
            className="bar-input"
            min="0"
            max="10"
            value={ratingUpper}
            onChange={(event) => setRatingUpper(event.target.value)}
            placeholder="Upper boundary"
            data-testid="ratingHigh"
          />
        </div>
        <div className="actors">
          <CreatableSelect
            components={components}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderWidth: 0,
              }),
            }}
            inputValue={actor}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newActor) => setActors(newActor)}
            onInputChange={(newActor) => setActor(newActor)}
            onKeyDown={handleKeyDown}
            placeholder="Type in actor and press enter"
            value={actors}
          />
        </div>
        <div className="country">
          <p>country</p>
          <input
            type="text"
            className="bar-input"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Country"
            data-testid="country"
          />
          <button type="submit">
            <SearchIcon />
          </button>
        </div>

        {/* </div> */}
      </form>
      <PaginationController
        pages={totalPages}
        page={page}
        setPage={setPage}
        pageChange={searchForMovies}
      />
    </div>
  );
};

export default SearchBar;
