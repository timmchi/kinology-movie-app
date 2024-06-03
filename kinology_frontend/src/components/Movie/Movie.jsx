import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotificationDispatch } from "../../contexts/NotificationContext";
import CommentForm from "../Comment/CommentForm";
import CommentList from "../Comment/CommentList";
import MovieButton from "./MovieButton";
import GenreList from "../ReusableComponents/GenreList";
import moviesService from "../../services/movies";
import commentsService from "../../services/comments";
const basePosterUrl = "https://image.tmdb.org/t/p/original";
import placeholderUrl from "../../../posterPlaceholder.png";
import PropTypes from "prop-types";

const Movie = ({ onButtonPress, onButtonUnpress, user }) => {
  let { id } = useParams();
  const [movie, setMovie] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useNotificationDispatch();

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await moviesService.getSingleMovie(id);
      setMovie(movie);
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await commentsService.getComments(id, "movie");
      setComments(fetchedComments);
    };

    fetchComments();
  }, [id]);

  const createComment = async (content) => {
    try {
      const createdComment = await commentsService.createComment(
        id,
        content,
        user,
        "movie",
        movie.title,
        movie.image
      );
      setComments(comments.concat(createdComment));
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment '${content}' successfully added`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when commenting on a movie ${movie}`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const deleteComment = async (commentId, authorId) => {
    if (window.confirm("Are you sure you want to delete the comment?")) {
      try {
        const filteredComments = comments.filter((c) => c.id !== commentId);
        setComments(filteredComments);
        await commentsService.deleteComment(
          id,
          commentId,
          user,
          authorId,
          "movie"
        );
        dispatch({
          type: "SHOW",
          payload: {
            message: `Comment successfully deleted`,
            type: "success",
          },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      } catch (exception) {
        dispatch({
          type: "SHOW",
          payload: {
            message: `Something went wrong when deleting a comment on ${movie.title}`,
            type: "error",
          },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      }
    }
  };

  const updateComment = async (commentId, content, authorId) => {
    try {
      const updatedComment = await commentsService.updateComment(
        id,
        commentId,
        user,
        content,
        authorId,
        "movie"
      );
      setComments(
        comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment successfully updated`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when updating a comment of ${user.name} on ${movie.title}`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

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

  console.log(movie);
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
