import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import InputField from "../ReusableComponents/InputField";
import { TextFieldElement } from "react-hook-form-mui";
import { object, string, minLength, email } from "valibot";
import SubmitButton from "../ReusableComponents/SubmitButton";
import Stack from "@mui/joy/Stack";
import contactService from "../../services/contact";
import { useNotificationDispatch } from "../../contexts/NotificationContext";
import PropTypes from "prop-types";

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
  "& .MuiInputBase-input": { color: "#0A6847" },
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

const ContactFormSchema = object({
  email: string([
    minLength(1, "Please enter your email."),
    email("The email address is badly formatted"),
  ]),
  name: string([
    minLength(1, "Please enter your name or nickname."),
    minLength(3, "Name or nickname should be 3 or more symbols"),
  ]),
  message: string([
    minLength(1, "Please enter your message"),
    minLength(3, "Message should be 3 or more symbols "),
  ]),
});

const ContactForm = ({ setOpen }) => {
  const dispatch = useNotificationDispatch();
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: valibotResolver(ContactFormSchema),
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
    try {
      console.log(data);
      await contactService.sendMessage(data);
      setOpen(false);
      dispatch({
        type: "SHOW",
        payload: {
          message: "Your message was sent successfully",
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when sending your message",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
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
          inputProps={{ spellCheck: "false" }}
          InputProps={{ sx: { borderRadius: 0 } }}
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

ContactForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};
