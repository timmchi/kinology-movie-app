import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import usersService from "../services/users";
import commentsService from "../services/comments";

const useUser = (currentUser, removeUser, id) => {
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [comments, setComments] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const updateFormRef = useRef();
  const commentFormRef = useRef();
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const { user: fetchedUser, avatarUrl } = await usersService.getUser(id);
      setAvatar(avatarUrl);
      setUser(fetchedUser);
      setFavoriteMovies(fetchedUser.favoriteMovies);
      setWatchedMovies(fetchedUser.watchedMovies);
      setWatchLaterMovies(fetchedUser.watchLaterMovies);
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await commentsService.getComments(id, "profile");
      setComments(fetchedComments);
    };
    fetchComments();
  }, [id]);

  const updateUser = async (formData) => {
    try {
      updateFormRef.current.toggleVisibility();
      const { user: updatedUser, avatarUrl } = await usersService.updateUser(
        id,
        formData
      );
      dispatch({
        type: "SHOW",
        payload: {
          message: `User ${
            updatedUser.name ? updatedUser.name : ""
          } successfully updated`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      setUser(updatedUser);
      setAvatar(avatarUrl);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when updating user",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const createComment = async (comment) => {
    try {
      commentFormRef.current.toggleVisibility();
      const createdComment = await commentsService.createComment(
        id,
        comment,
        currentUser,
        "profile"
      );
      setComments(comments.concat(createdComment));
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment '${comment}' successfully created`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when creating a comment",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  // Adding authorId here as well
  const deleteComment = async (commentId, authorId) => {
    if (window.confirm("Are you sure you want to delete the comment?")) {
      try {
        const filteredComments = comments.filter((c) => c.id !== commentId);
        setComments(filteredComments);
        await commentsService.deleteComment(
          user.id,
          commentId,
          currentUser,
          authorId,
          "profile"
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
            message: "Something went wrong when deleting a comment",
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
        currentUser,
        comment,
        authorId,
        "profile"
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

  const deleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This can't be undone"
      )
    ) {
      try {
        await usersService.deleteUser(user.id);
        removeUser(user.id);
        window.localStorage.removeItem("loggedKinologyUser");
        window.location.reload();
        navigate("/users");
        dispatch({
          type: "SHOW",
          payload: {
            message: `User ${user.name} successfully deleted`,
            type: "success",
          },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      } catch (exception) {
        dispatch({
          type: "SHOW",
          payload: {
            message: `Something went wrong when deleting a comment`,
            type: "error",
          },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      }
    }
  };

  return {
    user,
    avatar,
    setAvatar,
    comments,
    favoriteMovies,
    watchedMovies,
    watchLaterMovies,
    updateFormRef,
    commentFormRef,
    updateUser,
    createComment,
    deleteComment,
    updateComment,
    deleteUser,
  };
};

export default useUser;
