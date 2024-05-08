import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moviesService from "../services/movies";
const basePosterUrl = "https://image.tmdb.org/t/p/original";

const Movie = ({ onButtonPress, user }) => {
  let { id } = useParams();
  const [movie, setMovie] = useState("");

  //   console.log(id);

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await moviesService.getSingleMovie(id);
      setMovie(movie);
    };

    fetchMovie();
  }, [id]);

  return (
    <div>
      <div className="singleMovieContainer">
        <div className="singleMovieImage">
          <img
            src={`${basePosterUrl}${movie?.image}`}
            alt="movie poster"
            width="400"
          ></img>
        </div>
        <div className="singleMovieDescription">
          <h1>{movie.title}</h1>
          <p>
            <i>{movie.slogan}</i>
          </p>
          <p>{movie.overview}</p>
          <ul>
            {movie?.genres?.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
          <p>{movie.rating} rating</p>
          <p> released {movie.release}</p>
          <p>{movie.runtime} minutes</p>
          {user ? (
            <>
              <button
                onClick={(event) => onButtonPress(event, "watchList", id)}
              >
                Add to watch list
              </button>
              <button onClick={(event) => onButtonPress(event, "watched", id)}>
                Watched
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="singleMovieComments">
        <h2>Comments</h2>
      </div>
    </div>
  );
};

export default Movie;
