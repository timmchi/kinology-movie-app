import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import Button from "@mui/material/Button";
import Stack from "@mui/joy/Stack";
import { TextFieldElement } from "react-hook-form-mui";

const CommentSchema = object({
  content: string("Comment must be a string", [
    minLength(1, "Comments can not be empty"),
  ]),
});

const CommentForm = ({ commentAction, commentId, authorId }) => {
  //   const [content, setContent] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
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
    console.log(content);
    commentAction(content, commentId, authorId);
  };

  return (
    <form onSubmit={handleSubmit(submitComment)}>
      {/* <div>
        Your comment
        <input {...register("content")} placeholder="comment" />
        <p style={{ color: "red" }}>{errors.content?.message}</p>
      </div>
      <Button
        disabled={isSubmitting}
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#79C094",
          "&:hover": { backgroundColor: "#00532f" },
          marginBottom: 1,
        }}
        type="submit"
        id="comment-button"
      >
        {isSubmitting ? "Commenting..." : "Submit comment"}
      </Button> */}
      <Stack spacing={1} sx={{ paddingBottom: 1, display: "inline-flex" }}>
        <TextFieldElement
          name={"content"}
          label={"Your comment"}
          fullWIdth
          control={control}
          margin={"dense"}
          sx={{
            bgcolor: "#79C094",
            borderRadius: 2,
            label: { color: "white" },
            input: { color: "white" },
          }}
        />
        <Button
          disabled={isSubmitting}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#79C094",
            "&:hover": { backgroundColor: "#00532f" },
            marginBottom: 1,
          }}
          type="submit"
          id="comment-button"
        >
          {isSubmitting ? "Commenting..." : "Submit comment"}
        </Button>
      </Stack>
    </form>
  );
};

export default CommentForm;
