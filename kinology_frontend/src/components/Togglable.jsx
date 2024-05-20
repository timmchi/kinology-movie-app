import { useState, forwardRef, useImperativeHandle } from "react";
import Button from "@mui/material/Button";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#79C094",
            "&:hover": { backgroundColor: "#00532f" },
          }}
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#9b000a",
            "&:hover": { backgroundColor: "#730000" },
          }}
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = "TogglableElement";
export default Togglable;
