import { useParams } from "react-router-dom";
import CommentForm from "../Comment/CommentForm";
import CommentList from "../Comment/CommentList";
import MovieButton from "./MovieButton";
import GenreList from "../ReusableComponents/GenreList";
import useMovie from "../../hooks/useMovie";
const basePosterUrl = "https://image.tmdb.org/t/p/original";
import placeholderUrl from "../../../posterPlaceholder.png";
import PropTypes from "prop-types";

const Movie = ({ onButtonPress, onButtonUnpress, user }) => {
  const { id } = useParams();
  const { movie, comments, createComment, deleteComment, updateComment } =
    useMovie(user, id);

  const buttonPress = (event, functionWord) => {
    onButtonPress(event, functionWord, {
      id,
      title: movie.title,
      poster: movie.image,
    });
  };

  const buttonUnpress = (event, functionWord) => {
    onButtonUnpress(event, functionWord, {
      id,
    });
  };

  return (
    <div className="outerMovieContainer">
      <div className="moviePage">
        <div className="singleMovieContainer">
          <div className="singleMovieImage">
            <img
              src={
                movie.image ? `${basePosterUrl}${movie?.image}` : placeholderUrl
              }
              alt={
                movie.image
                  ? `${movie.title} poster`
                  : "Icon made by Freepik from www.flaticon.com"
              }
              width="400"
              className="movieImageElement"
            ></img>
          </div>
          <div className="singleMovieDescription">
            <h1>{movie.title}</h1>
            <p>
              <i>{movie.slogan}</i>
            </p>
            <p style={{ maxWidth: "800px" }}>{movie.overview}</p>
            <GenreList genres={movie?.genres} />
            <p>{movie.rating} rating</p>
            <p> released {movie.release}</p>
            <p>{movie.runtime} minutes</p>
            {user ? (
              <>
                <MovieButton
                  unpressedText={"Watch"}
                  pressedText={"Unwatch"}
                  onButtonPress={(e) => buttonPress(e, "later")}
                  onButtonUnpress={(e) => buttonUnpress(e, "later")}
                  movieId={id}
                  user={user}
                />
                <MovieButton
                  unpressedText={"Favorite"}
                  pressedText={"Unfavorite"}
                  onButtonPress={(e) => buttonPress(e, "favorite")}
                  onButtonUnpress={(e) => buttonUnpress(e, "favorite")}
                  movieId={id}
                  user={user}
                />
                <MovieButton
                  unpressedText={"Seen"}
                  pressedText={"Unsee"}
                  onButtonPress={(e) => buttonPress(e, "watched")}
                  onButtonUnpress={(e) => buttonUnpress(e, "watched")}
                  movieId={id}
                  user={user}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="singleMovieComments">
          <h2>Comments</h2>
          <CommentForm commentAction={createComment} label={"Your comment"} />
          <CommentList
            comments={comments}
            currentUser={user}
            onDelete={deleteComment}
            onEdit={updateComment}
          />
        </div>
      </div>
    </div>
  );
};

export default Movie;

Movie.propTypes = {
  onButtonPress: PropTypes.func,
  onButtonUnpress: PropTypes.func,
  user: PropTypes.object,
};
