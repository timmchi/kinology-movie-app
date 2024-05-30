import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import Togglable from "./Togglable";
import CommentForm from "./CommentForm";
import UserUpdateForm from "./UserUpdateForm";
import CommentList from "./CommentList";
import MovieSmallCard from "./MovieSmallCard";
import usersService from "../services/users";
import commentsService from "../services/comments";
import { Button } from "@mui/material";

const basePosterUrl = "https://image.tmdb.org/t/p/original";

const User = ({ currentUser, removeUser }) => {
  let { id } = useParams();
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

  const updateForm = () => {
    return (
      <Togglable buttonLabel="update profile" ref={updateFormRef}>
        <UserUpdateForm updateUser={updateUser} />
      </Togglable>
    );
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

  const commentCreateForm = () => {
    return (
      <Togglable buttonLabel="leave a comment" ref={commentFormRef}>
        <CommentForm commentAction={createComment} label={"Your comment"} />
      </Togglable>
    );
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

  // HERE I THINK
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

  return (
    <div className="outerContainer">
      <div className="userPage">
        <div className="userProfileContainer">
          <div className="userAvatar">
            <img
              src={avatar}
              width="300"
              height="300"
              alt="user avatar"
              className="avatar"
            />
            <div className="profileButtons">
              {currentUser && currentUser?.username === user.username && (
                <>
                  {updateForm()}
                  <Button
                    sx={{
                      backgroundColor: "#9b000a",
                      "&:hover": { backgroundColor: "#730000" },
                      alignSelf: "start",
                    }}
                    variant="contained"
                    size="small"
                    onClick={deleteUser}
                  >
                    Delete user
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="userInformation">
            <h1>
              <strong>{user.name}</strong>
            </h1>
            <div>
              <h2>About me</h2>
              <p>{user.biography}</p>
            </div>
            <div
              className="movieList"
              style={{ display: watchLaterMovies.length === 0 ? "none" : "" }}
            >
              <h3>Watch List</h3>
              <div className="profileMovieContainer">
                {watchLaterMovies?.map((movie) => (
                  <div key={`${movie.id} later`} className="movieSmallCard">
                    <MovieSmallCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="movieList"
              style={{ display: favoriteMovies.length === 0 ? "none" : "" }}
            >
              <h3>Favorite movies</h3>
              {/* 
        good candidate for refactoring, along with MovieList and big movie card */}
              <div className="profileMovieContainer">
                {favoriteMovies?.map((movie) => (
                  <div key={`${movie?.id} favorite`} className="movieSmallCard">
                    <MovieSmallCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="movieList"
              style={{ display: watchedMovies.length === 0 ? "none" : "" }}
            >
              <h3>Already seen</h3>
              <div className="profileMovieContainer">
                {watchedMovies?.map((movie) => (
                  <div key={`${movie.id} watched`} className="movieSmallCard">
                    <MovieSmallCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="userProfileComments">
          <h2>Comments</h2>
          <div className="profileCommentTogglable">
            {currentUser && commentCreateForm()}
          </div>
          <CommentList
            comments={comments}
            onDelete={deleteComment}
            onEdit={updateComment}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
