import React, { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import genreOptions from "../data/genres";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const SearchBar = () => {
  const [genres, setGenres] = useState([]);
  const [director, setDirector] = useState("");
  const [year, setYear] = useState(1888);
  const [ratingUpper, setRatingUpper] = useState(10);
  const [ratingLower, setRatingLower] = useState(0);
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [country, setCountry] = useState("");

  const searchForMovies = (e) => {
    e.preventDefault();
    console.log(
      genres,
      director,
      year,
      ratingUpper,
      ratingLower,
      actors.map((actor) => actor.value),
      country
    );
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
  //   const handleKeyDown = (event, input, setInput, setList) => {
  //     if (!input) return;
  //     switch (event.key) {
  //       case "Enter":
  //       case "Tab":
  //         setList((prev) => [...prev, createOption(input)]);
  //         setInput("");
  //         event.preventDefault();
  //     }
  //   };

  const onGenresChange = (e) => {
    const updatedGenres = e.map((genre) => genre.value);
    setGenres(updatedGenres);
  };

  return (
    <div>
      <h1>search bar</h1>
      <form onSubmit={searchForMovies}>
        <div>
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={genreOptions}
            placeholder="Select genres"
            onChange={onGenresChange}
          />
        </div>
        <div>
          director
          <input
            value={director}
            onChange={(event) => setDirector(event.target.value)}
            placeholder="Director"
            data-testid="director"
          />
        </div>
        <div>
          year
          <input
            type="number"
            min="1888"
            max={new Date().getFullYear()}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="Year"
            data-testid="year"
          />
        </div>
        <div>
          upper and lower boundary for rating
          <input
            type="number"
            min="0"
            max="10"
            value={ratingLower}
            onChange={(event) => setRatingLower(event.target.value)}
            placeholder="Lower boundary"
            data-testid="ratingLow"
          />
          <input
            type="number"
            min="0"
            max="10"
            value={ratingUpper}
            onChange={(event) => setRatingUpper(event.target.value)}
            placeholder="Upper boundary"
            data-testid="ratingHigh"
          />
        </div>
        <div>
          <CreatableSelect
            components={components}
            inputValue={actor}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newActor) => setActors(newActor)}
            onInputChange={(newActor) => setActor(newActor)}
            onKeyDown={handleKeyDown}
            placeholder="Type in name/names of actor/actors and press enter"
            value={actors}
          />
        </div>
        <div>
          country
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Country"
            data-testid="country"
          />
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
