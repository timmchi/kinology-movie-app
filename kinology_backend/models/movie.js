const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
  },
  watchedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserComment",
    },
  ],
});

movieSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
