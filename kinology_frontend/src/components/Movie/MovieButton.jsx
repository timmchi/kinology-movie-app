import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const movieButtonStyle = (pressed) => {
  return {
    borderColor: "#BDAC4E",
    "&:hover": {
      borderColor: "#BDAC4E",
      backgroundColor: pressed ? "#BDAC4E" : "primary",
    },
    backgroundColor: pressed ? "#BDAC4E" : "primary",
    borderWidth: 2,
    fontSize: 10,
    paddingLeft: 2,
    paddingRight: 2,
    color: pressed ? "black" : "white",
    marginRight: 1.5,
    boxShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
  };
};

const MovieButton = ({
  unpressedText,
  pressedText,
  onButtonPress,
  onButtonUnpress,
  movieId,
  user,
}) => {
  const [pressed, setPressed] = useState(() => {
    return (
      JSON.parse(
        localStorage.getItem(
          `pressed ${unpressedText} ${movieId} ${user?.username}`
        )
      ) ?? false
    );
  });

  useEffect(() => {
    localStorage.setItem(
      `pressed ${unpressedText} ${movieId} ${user?.username}`,
      JSON.stringify(pressed)
    );
  }, [movieId, user?.username, pressed, unpressedText]);

  const pressButton = (event) => {
    try {
      setPressed(!pressed);
      onButtonPress(event);
    } catch (exception) {
      console.log(exception);
    }
  };

  const unpressButton = (event) => {
    try {
      setPressed(!pressed);
      onButtonUnpress(event);
    } catch (exception) {
      console.log(exception);
    }
  };

  // button changes based on if the user has added the movie to their profile list (favorite, seen, wathc list). Same buttons go on the movie card and single movie page. To the person reading this - if you know of a better way to implement this functionality, please mention it in the issue. Thanks!

  return (
    <Button
      variant={pressed ? "contained" : "outlined"}
      size="small"
      color={pressed ? "success" : "primary"}
      sx={() => movieButtonStyle(pressed)}
      onClick={!pressed ? pressButton : unpressButton}
    >
      {!pressed ? unpressedText : pressedText}
    </Button>
  );
};

export default MovieButton;

MovieButton.propTypes = {
  unpressedText: PropTypes.string.isRequired,
  pressedText: PropTypes.string.isRequired,
  onButtonPress: PropTypes.func.isRequired,
  onButtonUnpress: PropTypes.func.isRequired,
  movieId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  user: PropTypes.object,
};
