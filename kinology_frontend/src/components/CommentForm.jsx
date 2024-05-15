import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import Button from "@mui/material/Button";

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
      <div>
        Your comment
        <input {...register("content")} />
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
      >
        {isSubmitting ? "Commenting..." : "Submit comment"}
      </Button>
    </form>
  );
};

export default CommentForm;
