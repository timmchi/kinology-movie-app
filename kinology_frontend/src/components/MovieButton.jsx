import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

// outlined contained

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

  return (
    <Button
      variant={pressed ? "contained" : "outlined"}
      size="small"
      color={pressed ? "success" : "primary"}
      sx={{
        borderColor: "#BDAC4E",
        "&:hover": {
          borderColor: "#BDAC4E",
          backgroundColor: pressed ? "#BDAC4E" : "primary",
        },
        backgroundColor: pressed ? "#BDAC4E" : "primary",
        borderWidth: 2,
        fontSize: 11,
        paddingLeft: 2,
        paddingRight: 2,
        color: "white",
        marginRight: 1.5,
        boxShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
      }}
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
