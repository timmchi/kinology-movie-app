import { useState } from "react";
import SearchBar from "./SearchBar";
import MovieList from "./MovieList";

const LandingPage = ({ onButtonPress, onButtonUnpress, user }) => {
  const [movies, setMovies] = useState([]);

  console.log("movies state in landing page", movies);
  return (
    <>
      <SearchBar setMovies={setMovies} />
      <MovieList
        movies={movies}
        onButtonPress={onButtonPress}
        onButtonUnpress={onButtonUnpress}
        user={user}
      />
    </>
  );
};

export default LandingPage;
