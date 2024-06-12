import { useState } from "react";
const basePosterUrl = "https://image.tmdb.org/t/p/original";
import placeholderUrl from "../../../posterPlaceholder.png";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardCover from "@mui/joy/CardCover";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import MovieButton from "./MovieButton";
import PropTypes from "prop-types";

const MovieCard = ({ movie, onButtonPress, onButtonUnpress, user }) => {
  const [posterIsLoaded, setPosterIsLoaded] = useState(false);

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
        width: 250,
        height: 379,
        borderRadius: 5,
        marginBottom: 3,
        textAlign: "center",
        backgroundColor: "#549a71",
      }}
      className="movieCard"
      data-testid="search-movie-card"
    >
      <div style={{ position: "relative" }}>
        <CardActionArea component={Link} to={`/movies/${movie.id}`}>
          <div style={{ position: "relative" }}>
            <CardMedia component="picture" sx={{ objectFit: "contain" }}>
              <img
                src={
                  posterIsLoaded
                    ? movie.image
                      ? `${basePosterUrl}${movie.image}`
                      : placeholderUrl
                    : placeholderUrl
                }
                alt={
                  movie.image
                    ? `${movie.title}`
                    : `${movie.title} poster Icon made by Freepik from www.flaticon.com`
                }
                height="375"
                loading="lazy"
                onLoad={() => setPosterIsLoaded(true)}
              />
            </CardMedia>

            <CardCover
              sx={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
                  color: "#f7e382",
                }}
              >
                {movie.title}
              </Typography>
            </div>
          </div>
        </CardActionArea>
        {user ? (
          <div
            style={{
              position: "absolute",
              bottom: "0%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 250,
            }}
          >
            <CardActions>
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
                pressedText={"Unsee"}
                onButtonPress={(e) => buttonPress(e, "watched")}
                onButtonUnpress={(e) => buttonUnpress(e, "watched")}
                movieId={movie.id}
                user={user}
              />
            </CardActions>
          </div>
        ) : (
          ""
        )}
      </div>
    </Card>
  );
};

export default MovieCard;

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  onButtonPress: PropTypes.func.isRequired,
  onButtonUnpress: PropTypes.func.isRequired,
  user: PropTypes.object,
};
