const UserComment = require("../models/userComment");

const fetchComment = async (commentId) => {
  const addedComment = await UserComment.findById(commentId)
    .populate("author", { name: 1, avatar: 1, username: 1 })
    .populate("receiver");

  return addedComment;
};

const createComment = async (content, author, receiver, type) => {
  const newComment =
    type === "movie"
      ? new UserComment({
          content,
          createdAt: Date.now(),
          author,
          movieReceiver: receiver,
        })
      : new UserComment({
          content,
          createdAt: Date.now(),
          author,
          receiver,
        });

  const savedComment = await newComment.save();
  return savedComment;
};

const handleSameProfileComment = async (comment, user) => {
  if (!user.authoredComments.includes(comment._id)) {
    user.authoredComments = user.authoredComments.concat(comment._id);
    user.profileComments = user.profileComments.concat(comment._id);
  }
};

const handleDifferentProfileComment = async (comment, user, receiver) => {
  if (!user.authoredComments.includes(comment._id)) {
    user.authoredComments = user.authoredComments.concat(comment._id);
    receiver.profileComments = receiver.profileComments.concat(comment._id);
  }
};

const handleSameProfileCommentDeletion = async (comment, user) => {
  if (user.authoredComments.includes(comment._id)) {
    user.authoredComments = user.authoredComments.filter(
      (c) => c._id.toString() !== comment._id.toString()
    );
    user.profileComments = user.profileComments.filter(
      (c) => c._id.toString() !== comment._id.toString()
    );
  }
};

const handleDifferentProfileCommentDeletion = async (
  comment,
  user,
  receiver
) => {
  if (user.authoredComments.includes(comment._id)) {
    user.authoredComments = user.authoredComments.filter(
      (c) => c._id.toString() !== comment._id.toString()
    );
    receiver.profileComments = receiver.profileComments.filter(
      (c) => c._id.toString() !== comment._id.toString()
    );
  }
};

module.exports = {
  fetchComment,
  createComment,
  handleSameProfileComment,
  handleDifferentProfileComment,
  handleSameProfileCommentDeletion,
  handleDifferentProfileCommentDeletion,
};
