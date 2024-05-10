import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

const basePosterUrl = "https://image.tmdb.org/t/p/original";

const MovieSmallCard = ({ movie }) => {
  return (
    <Card sx={{ maxWidth: 110, textAlign: "center" }}>
      <CardActionArea component={Link} to={`/movies/${movie.tmdbId}`}>
        <CardMedia
          component="img"
          loading="lazy"
          height="150"
          alt={`${movie.title} poster`}
          src={`${basePosterUrl}/${movie.poster}`}
        />
        <CardContent sx={{ padding: 0 }}>
          <Typography gutterBottom component="div">
            {movie.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieSmallCard;
