import MovieCard from "./MovieCard";

const MovieList = ({ movies }) => {
  if (!movies) return <>no movies yet</>;
  return (
    <div>
      {movies.map((movie) => (
        <MovieCard movie={movie} key={movie.id} />
      ))}
    </div>
  );
};

export default MovieList;
