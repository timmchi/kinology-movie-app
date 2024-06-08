import CommentList from "../Comment/CommentList";
import CommentForm from "../Comment/CommentForm";
import PropTypes from "prop-types";

const MovieComments = ({
  currentUser,
  createComment,
  comments,
  deleteComment,
  updateComment,
}) => {
  return (
    <div className="singleMovieComments">
      <h2>Comments</h2>
      {currentUser ? (
        <CommentForm commentAction={createComment} label={"Your comment"} />
      ) : (
        ""
      )}
      <CommentList
        comments={comments}
        onDelete={deleteComment}
        onEdit={updateComment}
      />
    </div>
  );
};

export default MovieComments;

MovieComments.propTypes = {
  currentUser: PropTypes.object,
  comments: PropTypes.arrayOf(PropTypes.object),
  deleteComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
};
