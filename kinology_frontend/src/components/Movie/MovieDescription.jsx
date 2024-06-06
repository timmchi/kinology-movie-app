import GenreList from "../ReusableComponents/GenreList";
import MovieButton from "./MovieButton";
import PropTypes from "prop-types";

const MovieDescription = ({
  movie,
  user,
  buttonPress,
  buttonUnpress,
  movieId,
}) => {
  return (
    <div className="singleMovieDescription">
      <h1>{movie.title}</h1>
      <p>
        <i>{movie.slogan}</i>
      </p>
      <p style={{ maxWidth: "800px" }}>{movie.overview}</p>
      <GenreList genres={movie?.genres} />
      <p>{movie.rating} rating</p>
      <p>released {movie.release}</p>
      <p>{movie.runtime} minutes</p>
      {user ? (
        <>
          <MovieButton
            unpressedText={"Watch"}
            pressedText={"Unwatch"}
            onButtonPress={(e) => buttonPress(e, "later")}
            onButtonUnpress={(e) => buttonUnpress(e, "later")}
            movieId={movieId}
            user={user}
          />
          <MovieButton
            unpressedText={"Favorite"}
            pressedText={"Unfavorite"}
            onButtonPress={(e) => buttonPress(e, "favorite")}
            onButtonUnpress={(e) => buttonUnpress(e, "favorite")}
            movieId={movieId}
            user={user}
          />
          <MovieButton
            unpressedText={"Seen"}
            pressedText={"Unsee"}
            onButtonPress={(e) => buttonPress(e, "watched")}
            onButtonUnpress={(e) => buttonUnpress(e, "watched")}
            movieId={movieId}
            user={user}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default MovieDescription;

MovieDescription.propTypes = {
  movie: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  buttonPress: PropTypes.func.isRequired,
  buttonUnpress: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  user: PropTypes.object,
};
