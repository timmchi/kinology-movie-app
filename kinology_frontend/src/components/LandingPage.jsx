import { useState } from "react";
import SearchBar from "./SearchBar";
import MovieList from "./MovieList";

const LandingPage = ({ onButtonPress }) => {
  const [movies, setMovies] = useState([]);

  console.log("movies state in landing page", movies);
  return (
    <>
      <SearchBar setMovies={setMovies} />
      <MovieList movies={movies} onButtonPress={onButtonPress} />
    </>
  );
};

export default LandingPage;
