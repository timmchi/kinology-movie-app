import MovieCard from "./MovieCard";

const MovieList = ({ movies }) => {
  if (!movies) return <>no movies yet</>;
  console.log("movies in MovieList", movies);

  const moviesList = movies.movieToFrontObjectArray;
  console.log(moviesList);

  return (
    <div className="listContainer">
      <h1 className="movieListHeading">Choice of Movies</h1>
      <div className="cardsContainer">
        {moviesList?.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
