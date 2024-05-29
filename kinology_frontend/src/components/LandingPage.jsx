import { useState } from "react";
import SearchModal from "./SearchModal";
import MovieList from "./MovieList";
import Hero from "./Hero";

const LandingPage = ({ onButtonPress, onButtonUnpress, user }) => {
  const [movies, setMovies] = useState([]);

  return (
    <>
      <Hero />
      <div id="search-function">
        <SearchModal setMovies={setMovies} />

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
