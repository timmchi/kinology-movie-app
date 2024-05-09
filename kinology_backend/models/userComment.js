const mongoose = require("mongoose");

const userCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieReceiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
});

userCommentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const UserComment = mongoose.model("UserComment", userCommentSchema);
module.exports = UserComment;
