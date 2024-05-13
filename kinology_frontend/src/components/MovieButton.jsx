import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

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
          `pressed ${unpressedText} ${movieId} ${user.username}`
        )
      ) ?? false
    );
  });

  useEffect(() => {
    localStorage.setItem(
      `pressed ${unpressedText} ${movieId} ${user.username}`,
      JSON.stringify(pressed)
    );
  }, [movieId, user.username, pressed, unpressedText]);

  const pressButton = (event) => {
    console.log("i am being pressed");
    try {
      setPressed(!pressed);
      onButtonPress(event);
    } catch (exception) {
      console.log(exception);
    }
  };

  const unpressButton = (event) => {
    console.log("i am being unpressed");
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
      onClick={!pressed ? pressButton : unpressButton}
    >
      {!pressed ? unpressedText : pressedText}
    </Button>
  );
};

export default MovieButton;
