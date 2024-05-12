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
  const [comments, setComments] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const updateFormRef = useRef();
  const commentFormRef = useRef();
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await usersService.getUser(id);
      setUser(fetchedUser);
      setFavoriteMovies(fetchedUser.favoriteMovies);
      setWatchedMovies(fetchedUser.watchedMovies);
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await commentsService.getProfileComments(id);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [id]);

  const updateUser = async (updatedInformation) => {
    try {
      updateFormRef.current.toggleVisibility();
      const updatedUser = await usersService.updateUser(id, updatedInformation);
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
      const createdComment = await commentsService.createProfileComment(
        id,
        comment,
        currentUser
      );
      setComments(comments.concat(createdComment));
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment ${comment} successfully created`,
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
        <CommentForm commentAction={createComment} />
      </Togglable>
    );
  };

  // Adding authorId here as well
  const deleteComment = async (commentId, authorId) => {
    if (window.confirm("Are you sure you want to delete the comment?")) {
      try {
        const filteredComments = comments.filter((c) => c.id !== commentId);
        setComments(filteredComments);
        await commentsService.deleteProfileComment(
          user.id,
          commentId,
          currentUser,
          authorId
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
      const updatedComment = await commentsService.updateProfileComment(
        id,
        commentId,
        currentUser,
        comment,
        authorId
      );
      setComments(
        comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
      );
      dispatch({
        type: "SHOW",
        payload: {
          message: `Comment ${comment} successfully updated`,
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

  console.log("user favorite movies", user?.favoriteMovies);
  console.log("user watched movies", user?.favoriteMovies);
  console.log(user);

  return (
    <div className="userPage">
      <h1>User</h1>
      {currentUser && currentUser?.username === user.username && (
        <>
          {updateForm()}
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={deleteUser}
          >
            Delete user
          </Button>
        </>
      )}
      <p>
        <strong>{user.name}</strong>
      </p>
      <img src={user.avatar} alt="user avatar" />
      <div>
        <h2>About me</h2>
        <p>{user.biography}</p>
      </div>
      <div className="movieList">
        <h3>favorite movies</h3>
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
      <div className="movieList">
        <h3>watched movies</h3>
        <div className="profileMovieContainer">
          {watchedMovies?.map((movie) => (
            <div key={`${movie.id} watched`} className="movieSmallCard">
              <MovieSmallCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>comments</h2>
        {currentUser && commentCreateForm()}
        <CommentList
          comments={comments}
          onDelete={deleteComment}
          onEdit={updateComment}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default User;
