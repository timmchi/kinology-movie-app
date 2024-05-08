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
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 5,
        marginBottom: 3,
        textAlign: "center",
      }}
      className="movieCard"
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt="movie poster"
          height="280"
          image={`${basePosterUrl}${movie.image}`}
          sx={{ objectFit: "cover" }}
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
