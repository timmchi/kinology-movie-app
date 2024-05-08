const basePosterUrl = "https://image.tmdb.org/t/p/original";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const MovieCard = ({ movie }) => {
  return (
    // <div>
    //   <h1>Movie</h1>
    //   <img href={`${basePosterUrl}${movie.image}`}></img>
    //   <p>{movie.title}</p>
    //   <button>Add to watch list</button>
    //   <button>Add to already seen</button>
    // </div>
    <Card
      sx={{ maxWidth: 200, borderRadius: 5, marginBottom: 3 }}
      className="movieCard"
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt="movie poster"
          height="200"
          image={`${basePosterUrl}${movie.image}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <button size="small">Add to watch list</button>
        <button size="small">Add to already seen</button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
