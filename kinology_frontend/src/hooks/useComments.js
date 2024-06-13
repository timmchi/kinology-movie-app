import { useEffect, useState } from "react";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import commentsService from "../services/comments";

const useComments = (id, type, user, movie) => {
  const [comments, setComments] = useState([]);
  const dispatch = useNotificationDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await commentsService.getComments(id, type);
      setComments(fetchedComments);
    };

    fetchComments();
  }, [id, type]);

  const createComment = async (comment) => {
    try {
      const createdComment = await commentsService.createComment(
        id,
        comment,
        user,
        type,
        type === "movie" ? movie.title : "",
        type === "movie" ? movie.image : ""
      );
      setComments(comments.concat(createdComment));
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment '${comment}' successfully added`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when commenting on a movie`,
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
          type
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

  const updateComment = async (commentId, comment, authorId) => {
    try {
      const updatedComment = await commentsService.updateComment(
        id,
        commentId,
        user,
        comment,
        authorId,
        type
      );
      setComments(
        comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment successfully updated with '${comment}'`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when updating a comment`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  return {
    comments,
    createComment,
    deleteComment,
    updateComment,
  };
};

export default useComments;
