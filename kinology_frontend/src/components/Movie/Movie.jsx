import { useParams } from "react-router-dom";
import MovieComments from "./MovieComments";
import useMovie from "../../hooks/useMovie";
import MovieProfilePoster from "./MovieProfilePoster";
import MovieDescription from "./MovieDescription";
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
          <MovieProfilePoster movie={movie} />
          <MovieDescription
            movie={movie}
            user={user}
            buttonPress={buttonPress}
            buttonUnpress={buttonUnpress}
            movieId={id}
          />
        </div>
        <MovieComments
          currentUser={user}
          createComment={createComment}
          comments={comments}
          deleteComment={deleteComment}
          updateComment={updateComment}
        />
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
