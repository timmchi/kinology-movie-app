import { useState } from "react";
import SearchBar from "./SearchBar";
import MovieList from "./MovieList";
import Hero from "./Hero";

const LandingPage = ({ onButtonPress, onButtonUnpress, user }) => {
  const [movies, setMovies] = useState([]);

  return (
    <>
      <Hero />
      <div id="search-function">
        <SearchBar setMovies={setMovies} />
        <MovieList
          movies={movies}
          onButtonPress={onButtonPress}
          onButtonUnpress={onButtonUnpress}
          user={user}
        />
      </div>
    </>
  );
};

export default LandingPage;
