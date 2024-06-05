import { useParams } from "react-router-dom";
import Togglable from "../Togglable/Togglable";
import CommentForm from "../Comment/CommentForm";
import UserUpdateForm from "./UserUpdateForm";
import CommentList from "../Comment/CommentList";
import MovieProfileList from "../Movie/MovieProfileList";
import { Button } from "@mui/material";
import placeholderUrl from "../../../avatar-placeholder.png";
import useUser from "../../hooks/useUser";
import PropTypes from "prop-types";

const User = ({ currentUser, removeUser }) => {
  const { id } = useParams();
  const {
    user,
    avatar,
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
    setAvatar,
  } = useUser(currentUser, removeUser, id);

  const updateForm = () => {
    return (
      <Togglable buttonLabel="update profile" ref={updateFormRef}>
        <UserUpdateForm updateUser={updateUser} />
      </Togglable>
    );
  };

  const commentCreateForm = () => {
    return (
      <Togglable buttonLabel="leave a comment" ref={commentFormRef}>
        <CommentForm commentAction={createComment} label={"Your comment"} />
      </Togglable>
    );
  };

  return (
    <div className="outerContainer">
      <div className="userPage">
        <div className="userProfileContainer">
          <div className="userAvatar">
            <img
              src={avatar ? avatar : placeholderUrl}
              onError={() => setAvatar(placeholderUrl)}
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
              <MovieProfileList
                movies={watchLaterMovies}
                header={"Watch List"}
              />
            </div>
            <div
              className="movieList"
              style={{ display: favoriteMovies.length === 0 ? "none" : "" }}
            >
              <MovieProfileList
                movies={favoriteMovies}
                header={"Favorite movies"}
              />
            </div>
            <div
              className="movieList"
              style={{ display: watchedMovies.length === 0 ? "none" : "" }}
            >
              <MovieProfileList
                movies={watchedMovies}
                header={"Already seen"}
              />
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

User.propTypes = {
  currentUser: PropTypes.object,
  removeUser: PropTypes.func.isRequired,
};
