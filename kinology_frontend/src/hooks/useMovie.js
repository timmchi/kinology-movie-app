// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moviesService from "../services/movies";

const useMovie = (id) => {
  const [movie, setMovie] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await moviesService.getSingleMovie(id);
      setMovie(movie);
    };

    fetchMovie();
  }, [id]);

  return {
    movie,
  };
};

export default useMovie;
