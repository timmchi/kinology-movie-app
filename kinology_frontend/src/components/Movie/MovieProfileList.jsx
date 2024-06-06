import MovieSmallCard from "./MovieSmallCard";
import PropTypes from "prop-types";

const MovieProfileList = ({ movies, header }) => {
  const moviesList = movies;

  return (
    <div
      className="movieList"
      style={{ display: moviesList.length === 0 ? "none" : "" }}
    >
      <h3>{header}</h3>
      <div className="profileMovieContainer">
        {moviesList?.map((movie) => (
          <div
            key={`${movie.id ? movie.id : movie.tmdbId} header`}
            className="movieSmallCard"
          >
            <MovieSmallCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieProfileList;

MovieProfileList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  header: PropTypes.string,
};
