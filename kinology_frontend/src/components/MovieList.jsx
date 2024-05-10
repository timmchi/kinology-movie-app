import MovieCard from "./MovieCard";

const MovieList = ({ movies, onButtonPress }) => {
  if (!movies) return <>no movies yet</>;
  console.log("movies in MovieList", movies);

  const moviesList = movies;
  console.log(moviesList);

  return (
    <div className="listContainer">
      {/* <h1 className="movieListHeading">Choice of Movies</h1> */}
      <div className="cardsContainer">
        {moviesList?.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
            onButtonPress={onButtonPress}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
