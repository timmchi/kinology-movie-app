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
    setPressed(!pressed);
    // onButtonPress(event);
  };

  const unpressButton = (event) => {
    console.log("i am being unpressed");
    setPressed(!pressed);
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
