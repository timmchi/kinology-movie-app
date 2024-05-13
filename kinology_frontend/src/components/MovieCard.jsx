const basePosterUrl = "https://image.tmdb.org/t/p/original";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import MovieButton from "./MovieButton";

const MovieCard = ({ movie, onButtonPress, onButtonUnpress, user }) => {
  const buttonPress = (event, functionWord) => {
    onButtonPress(event, functionWord, {
      id: movie.id,
      title: movie.title,
      poster: movie.image,
    });
  };

  const buttonUnpress = (event, functionWord) => {
    onButtonUnpress(event, functionWord, {
      id: movie.id,
    });
  };

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
          loading="lazy"
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
        {/* TODO need to implement functionality to add to watch later */}
        <MovieButton
          unpressedText={"Watch"}
          pressedText={"Unwatch"}
          movieId={movie.id}
          user={user}
          onButtonPress={(e) => buttonPress(e, "later")}
          onButtonUnpress={(e) => buttonUnpress(e, "later")}
        />
        <MovieButton
          unpressedText={"Favorite"}
          pressedText={"Unfavorite"}
          onButtonPress={(e) => buttonPress(e, "favorite")}
          onButtonUnpress={(e) => buttonUnpress(e, "favorite")}
          movieId={movie.id}
          user={user}
        />
        <MovieButton
          unpressedText={"Seen"}
          pressedText={"Remove from seen"}
          onButtonPress={(e) => buttonPress(e, "watched")}
          onButtonUnpress={(e) => buttonUnpress(e, "watched")}
          movieId={movie.id}
          user={user}
        />
      </CardActions>
    </Card>
  );
};

export default MovieCard;
