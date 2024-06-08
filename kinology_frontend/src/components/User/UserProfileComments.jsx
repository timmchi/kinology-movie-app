import CommentList from "../Comment/CommentList";
import PropTypes from "prop-types";

const UserProfileComments = ({
  currentUser,
  commentCreateForm,
  comments,
  deleteComment,
  updateComment,
}) => {
  return (
    <div className="userProfileComments">
      <h2>Comments</h2>
      <div className="profileCommentTogglable">
        {currentUser && commentCreateForm()}
      </div>
      <CommentList
        comments={comments}
        onDelete={deleteComment}
        onEdit={updateComment}
      />
    </div>
  );
};

export default UserProfileComments;

UserProfileComments.propTypes = {
  currentUser: PropTypes.object,
  commentCreateForm: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object),
  deleteComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
};
