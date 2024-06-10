import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import placeholderUrl from "../../../posterPlaceholder.png";
import PropTypes from "prop-types";

const basePosterUrl = "https://image.tmdb.org/t/p/original";

const MovieSmallCard = ({ movie }) => {
  return (
    <Card sx={{ maxWidth: 110 }}>
      <CardActionArea component={Link} to={`/movies/${movie.tmdbId}`}>
        <CardMedia
          component="img"
          loading="lazy"
          height="150"
          alt={
            movie.image
              ? `${movie.title} poster`
              : "Icon made by Freepik from www.flaticon.com"
          }
          src={movie.image ? `${basePosterUrl}${movie?.image}` : placeholderUrl}
        />
      </CardActionArea>
    </Card>
  );
};

export default MovieSmallCard;

MovieSmallCard.propTypes = {
  movie: PropTypes.object.isRequired,
};
