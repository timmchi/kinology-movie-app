import { useState } from "react";
import Button from "@mui/material/Button";

// outlined contained

const MovieButton = ({
  unpressedText,
  pressedText,
  onButtonPress,
  buttonState = false,
}) => {
  const [pressed, setPressed] = useState(buttonState);

  const pressButton = (event) => {
    setPressed(!pressed);
    onButtonPress(event);
  };

  return (
    <Button
      variant={pressed ? "contained" : "outlined"}
      size="small"
      color={pressed ? "success" : "primary"}
      onClick={pressButton}
    >
      {pressed ? pressedText : unpressedText}
    </Button>
  );
};

export default MovieButton;
