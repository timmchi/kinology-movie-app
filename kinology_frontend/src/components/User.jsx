import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Togglable from "./Togglable";
import CommentForm from "./CommentForm";
import UserUpdateForm from "./UserUpdateForm";
import CommentList from "./CommentList";
import usersService from "../services/users";
import commentsService from "../services/comments";

const basePosterUrl = "https://image.tmdb.org/t/p/original";

const User = ({ currentUser }) => {
  let { id } = useParams();
  const [user, setUser] = useState("");
  const [comments, setComments] = useState([]);
  const updateFormRef = useRef();
  const commentFormRef = useRef();

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

  //   console.log(user?.favoriteMovies);

  return (
    <div>
      <h1>User</h1>
      {currentUser && currentUser?.username === user.username && updateForm()}
      <p>
        <strong>{user.name}</strong>
      </p>
      <img src={user.avatar} alt="user avatar" />
      <div>
        <h2>About me</h2>
        <p>{user.biography}</p>
      </div>
      <div>
        <h3>favorite movies</h3>

        {user?.favoriteMovies?.map((movie) => (
          <div key={`${movie.id} favorite`}>
            {movie.tmdbId} {movie.title}{" "}
            <img
              alt={`${movie.title} poster`}
              src={`${basePosterUrl}/${movie.poster}`}
              width="100"
              height="150"
            />
          </div>
        ))}
      </div>
      <div>
        <h3>watched movies</h3>

        {user?.watchedMovies?.map((movie) => (
          <div key={`${movie.id} watched`}>
            {movie.tmdbId} {movie.title}{" "}
            <img
              alt={`${movie.title} poster`}
              src={`${basePosterUrl}/${movie.poster}`}
              width="100"
              height="150"
            />
          </div>
        ))}
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
