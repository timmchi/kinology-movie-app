import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import SubmitButton from "../ReusableComponents/SubmitButton";
import Stack from "@mui/joy/Stack";
import { TextFieldElement } from "react-hook-form-mui";
import PropTypes from "prop-types";

const commentInputStyle = {
  bgcolor: "#79C094",
  label: { color: "white" },
  input: {
    color: "white",
    textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& label.Mui-error": {
    fontWeight: "bold",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "yellow",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#397453",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#bdac4e",
    },
    "&.Mui-error fieldset": {
      borderWidth: 2,
    },
  },
};

const CommentSchema = object({
  content: string("Comment must be a string", [
    minLength(1, "Comments can not be empty"),
  ]),
});

const CommentForm = ({ commentAction, commentId, authorId, label }) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: valibotResolver(CommentSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        content: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  // comments are created and edited in the same way. On creation, commentId and authorId are not used, but on edit, they are
  const submitComment = async ({ content }) => {
    commentAction(content, commentId, authorId);
  };

  return (
    <form onSubmit={handleSubmit(submitComment)}>
      <Stack spacing={1} sx={{ paddingBottom: 1, display: "inline-flex" }}>
        <TextFieldElement
          name={"content"}
          label={label}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{ sx: { borderRadius: 0 } }}
          sx={commentInputStyle}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          label={"Submit comment"}
          submittingText={"Commenting..."}
          normalText={"Submit comment"}
          id="comment-button"
        />
      </Stack>
    </form>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  commentAction: PropTypes.func,
  commentId: PropTypes.string,
  authorId: PropTypes.string,
  label: PropTypes.string,
};
