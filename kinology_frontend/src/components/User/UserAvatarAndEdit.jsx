import EditProfileButtons from "./EditProfileButtons";
import placeholderUrl from "../../../avatar-placeholder.png";
import PropTypes from "prop-types";

const UserAvatarAndEdit = ({
  avatar,
  setAvatar,
  user,
  updateForm,
  deleteUser,
}) => {
  return (
    <div className="userAvatar">
      <img
        src={avatar ? avatar : placeholderUrl}
        onError={() => setAvatar(placeholderUrl)}
        width="300"
        height="300"
        alt="user avatar"
        className="avatar"
      />
      <EditProfileButtons
        user={user}
        updateForm={updateForm}
        deleteUser={deleteUser}
      />
    </div>
  );
};

export default UserAvatarAndEdit;

UserAvatarAndEdit.propTypes = {
  avatar: PropTypes.string.isRequired,
  setAvatar: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updateForm: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};
