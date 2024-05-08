const basePosterUrl = "https://image.tmdb.org/t/p/original";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const MovieCard = ({ movie }) => {
  return (
    <Card
      sx={{
        maxWidth: 250,
        borderRadius: 5,
        marginBottom: 3,
        textAlign: "center",
        backgroundColor: "#F7E382",
      }}
      className="movieCard"
    >
      <CardActionArea component={Link} to={`/movies/${movie.id}`}>
        <CardMedia
          component="img"
          alt="movie poster"
          height="280"
          image={`${basePosterUrl}${movie.image}`}
          sx={{ objectFit: "contain", marginTop: 3 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" variant="outlined">
          Add to watch list
        </Button>
        <Button size="small" variant="outlined">
          Add to already seen
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
