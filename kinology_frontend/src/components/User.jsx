import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Togglable from "./Togglable";
import CommentForm from "./CommentForm";
import UserUpdateForm from "./UserUpdateForm";
import CommentList from "./CommentList";
import usersService from "../services/users";
import commentsService from "../services/comments";

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

  const commentForm = () => {
    return (
      <Togglable buttonLabel="leave a comment" ref={commentFormRef}>
        <CommentForm createComment={createComment} />
      </Togglable>
    );
  };

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
        <ul>
          {user?.favoriteMovies?.map((movie) => (
            <li key={movie.id}>{movie.tmdbId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>watched movies</h3>
        <ul>
          {user?.watchedMovies?.map((movie) => (
            <li key={movie.id}>{movie.tmdbId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>comments</h2>
        {currentUser && commentForm()}
        <CommentList comments={comments} />
      </div>
    </div>
  );
};

export default User;
