import Button from "@mui/material/Button";

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
