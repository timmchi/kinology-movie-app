import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import InputField from "./InputField";
import { TextFieldElement } from "react-hook-form-mui";
import { object, string, minLength } from "valibot";
import SubmitButton from "./SubmitButton";
import Stack from "@mui/joy/Stack";
import contactService from "../services/contact";

const textInputStyle = {
  label: { color: "#0A6847" },
  input: {
    color: "#0A6847",
  },
  "& label.Mui-focused": {
    color: "#0A6847",
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
      borderColor: "#609b76",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#bdac4e",
    },
    "&.Mui-error fieldset": {
      borderWidth: 2,
    },
  },
};

const ContactForm = () => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm({
    // resolver: valibotResolver(CommentSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        email: "",
        message: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const submitMessage = async (data) => {
    console.log(data);
    await contactService.sendMessage(data);
  };

  return (
    <form onSubmit={handleSubmit(submitMessage)}>
      <Stack spacing={1} sx={{ paddingBottom: 1 }}>
        <InputField name="name" label="Name" control={control} />
        <InputField name="email" label="Email" control={control} />
        <TextFieldElement
          name="message"
          label="Your message"
          multiline
          minRows={5}
          maxRows={Infinity}
          sx={textInputStyle}
          control={control}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          label="Submit message"
          submittingText="Sending message..."
          normalText="Send message"
        />
      </Stack>
    </form>
  );
};

export default ContactForm;
