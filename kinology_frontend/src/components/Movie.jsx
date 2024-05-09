import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import moviesService from "../services/movies";
import commentsService from "../services/comments";
const basePosterUrl = "https://image.tmdb.org/t/p/original";

const Movie = ({ onButtonPress, user }) => {
  let { id } = useParams();
  const [movie, setMovie] = useState("");
  const [comments, setComments] = useState([]);

  console.log("id in movie", id);
  console.log(comments);

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await moviesService.getSingleMovie(id);
      setMovie(movie);
    };

    fetchMovie();
  }, [id]);

  // movie.id or id better?
  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await commentsService.getMovieComments(id);
      setComments(fetchedComments);
    };

    fetchComments();
  }, [id]);

  // movie.id or id better?
  const createComment = async (content) => {
    const createdComment = await commentsService.createMovieComment(
      id,
      content,
      user
    );
    setComments(comments.concat(createdComment));
  };

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
              <button onClick={(event) => onButtonPress(event, "favorite", id)}>
                Add to favorites
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
        <CommentForm commentAction={createComment} />

        {comments?.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.author.name}</strong>
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movie;
