import { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import placeholderUrl from "../../../posterPlaceholder.png";
import PropTypes from "prop-types";

const basePosterUrl = "https://image.tmdb.org/t/p/original";

// img component inside cardmedia is used to access attributes like onLoad to include placeholder
const MovieSmallCard = ({ movie }) => {
  const [posterIsLoaded, setPosterIsLoaded] = useState(false);
  return (
    <Card sx={{ width: 100, height: 150 }}>
      <CardActionArea component={Link} to={`/movies/${movie.tmdbId}`}>
        <CardMedia component="picture" sx={{ objectFit: "contain" }}>
          <img
            src={
              posterIsLoaded
                ? movie.poster
                  ? `${basePosterUrl}${movie.poster}`
                  : placeholderUrl
                : placeholderUrl
            }
            alt={`${movie.title} poster`}
            height="150"
            loading="lazy"
            onLoad={() => setPosterIsLoaded(true)}
          />
        </CardMedia>
      </CardActionArea>
    </Card>
  );
};

export default MovieSmallCard;

MovieSmallCard.propTypes = {
  movie: PropTypes.object.isRequired,
};
