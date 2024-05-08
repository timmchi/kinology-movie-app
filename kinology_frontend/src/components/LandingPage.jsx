import SearchBar from "./SearchBar";
import MovieList from "./MovieList";

const LandingPage = ({ setMovies, movies }) => {
  return (
    <>
      <SearchBar setMovies={setMovies} />
      <MovieList movies={movies} />
    </>
  );
};

export default LandingPage;
