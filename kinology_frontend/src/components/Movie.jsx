import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moviesService from "../services/movies";
const basePosterUrl = "https://image.tmdb.org/t/p/original";

const Movie = () => {
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

  //   console.log(movie);
  //   console.log(`${basePosterUrl}${movie?.image}`);
  return (
    <div>
      <h1>Movie</h1>
      <img
        src={`${basePosterUrl}${movie?.image}`}
        alt="movie poster"
        width="400"
      ></img>
      <p>
        <strong>{movie.title}</strong>
      </p>
      <p>{movie.overview}</p>
      <ul>
        {movie?.genres?.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
      <p>{movie.rating}</p>
      <p>{movie.release}</p>
      <p>{movie.runtime}</p>
      <p>{movie.slogan}</p>
      <div>
        <h2>Comments</h2>
      </div>
    </div>
  );
};

export default Movie;
