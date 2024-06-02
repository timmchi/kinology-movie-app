import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const SubmitButton = ({ isSubmitting, label, submittingText, normalText }) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      aria-label={label}
      variant="contained"
      size="small"
      sx={{
        backgroundColor: "#609b76",
        "&:hover": { backgroundColor: "#00532f" },
        marginBottom: 1,
      }}
    >
      {isSubmitting ? submittingText : normalText}
    </Button>
  );
};

export default SubmitButton;

SubmitButton.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  submittingText: PropTypes.string.isRequired,
  normalText: PropTypes.string.isRequired,
};
