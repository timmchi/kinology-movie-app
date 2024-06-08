import MovieCard from "./MovieCard";
import { useUserValue } from "../../contexts/UserContext";
import PropTypes from "prop-types";

const MovieList = ({ movies, onButtonPress, onButtonUnpress }) => {
  const user = useUserValue();
  if (!movies) return <>no movies yet</>;

  const moviesList = movies;

  return (
    <div className="listContainer">
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
};
