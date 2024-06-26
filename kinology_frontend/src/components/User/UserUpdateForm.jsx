import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Button from "@mui/material/Button";
import Stack from "@mui/joy/Stack";
import { TextFieldElement } from "react-hook-form-mui";
import { MuiFileInput } from "mui-file-input";
import {
  object,
  string,
  minLength,
  mimeType,
  maxSize,
  instance,
  pipe,
} from "valibot";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const UserUpdateSchema = object({
  bio: pipe(
    string("About you should be a string"),
    minLength(1, "Please enter something about yourself.")
  ),
  name: pipe(
    string("Name should be a string"),
    minLength(1, "Please enter your name"),
    minLength(3, "Name should be 3 or more symbols long")
  ),
  avatar: pipe(
    instance(File),
    mimeType(["image/jpeg", "image/png", "image/jpg", "image/svg"]),
    maxSize(1024 * 1024 * 2)
  ),
});

const inputStyle = {
  bgcolor: "#79C094",
  label: {
    color: "white",
    textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
  },
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

const UserUpdateForm = ({ updateUser }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ resolver: valibotResolver(UserUpdateSchema) });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ bio: "", name: "", avatar: null });
    }
  }, [isSubmitSuccessful, reset]);

  const updatingUser = (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar);
    formData.append("bio", data.bio);
    formData.append("name", data.name);

    updateUser(formData);
  };

  return (
    <form onSubmit={handleSubmit(updatingUser)}>
      <Stack
        spacing={1}
        sx={{ paddingBottom: 1, paddingRight: 1, maxWidth: "310px" }}
      >
        <TextFieldElement
          name={"bio"}
          label={"About you"}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{ sx: { borderRadius: 0 } }}
          sx={inputStyle}
        />
        <TextFieldElement
          name={"name"}
          label={"Name"}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{ sx: { borderRadius: 0 } }}
          sx={inputStyle}
        />
        <Typography>Upload Avatar</Typography>
        {/* mui file input used here to keep styling consistent with other elements. Another option would be to implement a drag and drop */}
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <MuiFileInput
              {...field}
              inputProps={{ accept: ".png, .jpeg, .jpg, .svg" }}
              InputProps={{ sx: { borderRadius: 0 } }}
              placeholder="Insert a file"
              sx={inputStyle}
            />
          )}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          id="update-button"
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#609b76",
            "&:hover": { backgroundColor: "#00532f" },
            marginBottom: 1,
          }}
        >
          {isSubmitting ? "Updating..." : "Update your profile"}
        </Button>
      </Stack>
    </form>
  );
};

export default UserUpdateForm;

UserUpdateForm.propTypes = {
  updateUser: PropTypes.func.isRequired,
};
