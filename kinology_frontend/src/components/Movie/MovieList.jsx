import MovieCard from "./MovieCard";
import PropTypes from "prop-types";

const MovieList = ({ movies, onButtonPress, onButtonUnpress, user }) => {
  if (!movies) return <>no movies yet</>;

  const moviesList = movies;

  return (
    <div className="listContainer">
      {/* <h1 className="movieListHeading">Choice of Movies</h1> */}
      <div className="cardsContainer">
        {moviesList?.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id ? movie.id : movie.tmdbId}
            onButtonPress={onButtonPress}
            onButtonUnpress={onButtonUnpress}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  onButtonPress: PropTypes.func.isRequired,
  onButtonUnpress: PropTypes.func.isRequired,
  user: PropTypes.object,
};
