import MovieCard from "./MovieCard";
import { useUserValue } from "../../contexts/UserContext";
import PropTypes from "prop-types";

const MovieList = ({ movies, onButtonPress, onButtonUnpress }) => {
  const user = useUserValue();

  const moviesList = movies;

  // different keys are used to avoid issue with testing, where mock movie is used
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
