import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const updateFormRef = useRef();
  const commentFormRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await usersService.getUser(id);
      setUser(fetchedUser);
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
    updateFormRef.current.toggleVisibility();
    const updatedUser = await usersService.updateUser(id, updatedInformation);
    setUser(updatedUser);
  };

  const updateForm = () => {
    return (
      <Togglable buttonLabel="update profile" ref={updateFormRef}>
        <UserUpdateForm updateUser={updateUser} />
      </Togglable>
    );
  };

  const createComment = async (comment) => {
    commentFormRef.current.toggleVisibility();
    const createdComment = await commentsService.createProfileComment(
      id,
      comment,
      currentUser
    );
    setComments(comments.concat(createdComment));
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
      const filteredComments = comments.filter((c) => c.id !== commentId);
      setComments(filteredComments);
      await commentsService.deleteProfileComment(
        user.id,
        commentId,
        currentUser,
        authorId
      );
    }
  };

  // HERE I THINK
  const updateComment = async (commentId, comment, authorId) => {
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
  };

  const deleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This can't be undone"
      )
    ) {
      await usersService.deleteUser(user.id);
      removeUser(user.id);
      window.localStorage.removeItem("loggedKinologyUser");
      navigate("/users");
    }
  };

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
          {user?.favoriteMovies?.map((movie) => (
            <div key={`${movie.id} favorite`} className="movieSmallCard">
              <MovieSmallCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      <div className="movieList">
        <h3>watched movies</h3>
        <div className="profileMovieContainer">
          {user?.watchedMovies?.map((movie) => (
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
