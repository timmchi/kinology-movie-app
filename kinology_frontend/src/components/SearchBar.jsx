import React, { useState, KeyboardEventHandler } from "react";
import CreatableSelect from "react-select";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const SearchBar = () => {
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState(1888);
  const [ratingUpper, setRatingUpper] = useState(10);
  const [ratingLower, setRatingLower] = useState(0);
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [country, setCountry] = useState("");

  const searchForMovies = () => {};

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

  return (
    <div>
      <h1>search bar</h1>
      <form onSubmit={searchForMovies}>
        <div>
          genre
          <input
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            placeholder="Genre"
            data-testid="genre"
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
            onChange={(event) => setGenre(event.target.value)}
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
            onChange={(newActor) => setActor(newActor)}
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
      </form>
    </div>
  );
};

export default SearchBar;
