const basePosterUrl = "https://image.tmdb.org/t/p/original";

const Movie = ({ movie }) => {
  return (
    <div>
      <h1>Movie</h1>
      <img href={`${basePosterUrl}${movie.image}`}></img>
      <p>{movie.title}</p>
    </div>
  );
};

export default Movie;
