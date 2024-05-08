import { useState } from "react";
import SearchBar from "./SearchBar";
import MovieList from "./MovieList";

const LandingPage = () => {
  const [movies, setMovies] = useState([]);

  console.log("movies state in landing page", movies);
  return (
    <>
      <SearchBar setMovies={setMovies} />
      <MovieList movies={movies} />
    </>
  );
};

export default LandingPage;
