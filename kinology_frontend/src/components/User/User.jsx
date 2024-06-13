import { useParams } from "react-router-dom";
import Togglable from "../Togglable/Togglable";
import CommentForm from "../Comment/CommentForm";
import UserUpdateForm from "./UserUpdateForm";
import MovieProfileList from "../Movie/MovieProfileList";
import UserProfileComments from "./UserProfileComments";
import UserInfo from "./UserInfo";
import UserAvatarAndEdit from "./UserAvatarAndEdit";
import useUser from "../../hooks/useUser";
import useComments from "../../hooks/useComments";
import { useUserValue } from "../../contexts/UserContext";
import PropTypes from "prop-types";

const User = ({ removeUser }) => {
  const { id } = useParams();
  const currentUser = useUserValue();
  const {
    user,
    avatar,
    // comments,
    favoriteMovies,
    watchedMovies,
    watchLaterMovies,
    updateFormRef,
    commentFormRef,
    updateUser,
    // createComment,
    // deleteComment,
    // updateComment,
    deleteUser,
    setAvatar,
  } = useUser(currentUser, removeUser, id);

  const { comments, createComment, deleteComment, updateComment } = useComments(
    id,
    "profile",
    currentUser
  );

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
          <UserAvatarAndEdit
            avatar={avatar}
            setAvatar={setAvatar}
            user={user}
            updateForm={updateForm}
            deleteUser={deleteUser}
          />
          <div className="userInformation">
            <UserInfo name={user.name} biography={user.biography} />

            <MovieProfileList movies={watchLaterMovies} header={"Watch List"} />
            <MovieProfileList
              movies={favoriteMovies}
              header={"Favorite movies"}
            />
            <MovieProfileList movies={watchedMovies} header={"Already seen"} />
          </div>
        </div>
        <UserProfileComments
          currentUser={currentUser}
          commentCreateForm={commentCreateForm}
          comments={comments}
          deleteComment={deleteComment}
          updateComment={updateComment}
        />
      </div>
    </div>
  );
};

export default User;

User.propTypes = {
  removeUser: PropTypes.func.isRequired,
};
