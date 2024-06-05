// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import moviesService from "../services/movies";
import commentsService from "../services/comments";

const useMovie = (user, id) => {
  //   const { id } = useParams();
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

  return {
    movie,
    comments,
    createComment,
    deleteComment,
    updateComment,
  };
};

export default useMovie;
