const basePosterUrl = "https://image.tmdb.org/t/p/original";
import placeholderUrl from "../../../posterPlaceholder.png";
import PropTypes from "prop-types";

const MovieProfilePoster = ({ movie }) => {
  return (
    <div className="singleMovieImage">
      <img
        src={movie.image ? `${basePosterUrl}${movie?.image}` : placeholderUrl}
        alt={
          movie.image
            ? `${movie.title} poster`
            : "Icon made by Freepik from www.flaticon.com"
        }
        width="400"
        className="movieImageElement"
      ></img>
    </div>
  );
};

export default MovieProfilePoster;

MovieProfilePoster.propTypes = {
  movie: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
