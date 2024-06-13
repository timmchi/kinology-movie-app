const handleUnwatchAction = async (movie, user) => {
  if (movie.watchLaterBy.includes(user._id)) {
    movie.watchLaterBy = movie.watchLaterBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.watchLaterMovies.includes(movie._id)) {
    user.watchLaterMovies = user.watchLaterMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
  }
};

const handleUnseeAction = async (movie, user) => {
  if (movie.watchedBy.includes(user._id)) {
    movie.watchedBy = movie.watchedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.watchedMovies.includes(movie._id)) {
    user.watchedMovies = user.watchedMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
  }
};

const handleUnfavoriteAction = async (movie, user) => {
  if (movie.favoritedBy.includes(user._id)) {
    movie.favoritedBy = movie.favoritedBy.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
  }
  if (user.favoriteMovies.includes(movie._id)) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (movieId) => movieId.toString() !== movie._id.toString()
    );
  }
};

const handleWatchLaterAction = async (movie, user) => {
  if (!movie.watchLaterBy.includes(user._id)) {
    movie.watchLaterBy = movie.watchLaterBy.concat(user._id);
  }
  if (!user.watchLaterMovies.includes(movie._id)) {
    user.watchLaterMovies = user.watchLaterMovies.concat(movie._id);
  }
};

const handleWatchedAction = async (movie, user) => {
  if (!movie.watchedBy.includes(user._id)) {
    movie.watchedBy = movie.watchedBy.concat(user._id);
  }
  if (!user.watchedMovies.includes(movie._id)) {
    user.watchedMovies = user.watchedMovies.concat(movie._id);
  }
};

const handleFavoriteAction = async (movie, user) => {
  if (!movie.favoritedBy.includes(user._id)) {
    movie.favoritedBy = movie.favoritedBy.concat(user._id);
  }
  if (!user.favoriteMovies.includes(movie._id)) {
    user.favoriteMovies = user.favoriteMovies.concat(movie._id);
  }
};

module.exports = {
  handleUnwatchAction,
  handleUnseeAction,
  handleUnfavoriteAction,
  handleWatchLaterAction,
  handleWatchedAction,
  handleFavoriteAction,
};
