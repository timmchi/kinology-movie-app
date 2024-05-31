import MovieSmallCard from "./MovieSmallCard";

const MovieProfileList = ({ movies, header }) => {
  const moviesList = movies;

  return (
    <>
      <h3>{header}</h3>
      <div className="profileMovieContainer">
        {moviesList?.map((movie) => (
          <div key={`${movie?.id} header`} className="movieSmallCard">
            <MovieSmallCard movie={movie} />
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieProfileList;
