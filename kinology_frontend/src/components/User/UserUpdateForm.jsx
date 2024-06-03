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
  parse,
  unknown,
} from "valibot";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const UserUpdateSchema = object(
  {
    bio: string("About you should be a string", [
      minLength(1, "Please enter something about yourself."),
    ]),
    name: string("Name should be a string", [
      minLength(1, "Please enter your name"),
      minLength(3, "Name should be 3 or more symbols long"),
    ]),
  },
  unknown()
);

const FileSchema = instance(File, [
  mimeType(["image/jpeg", "image/png", "image/jpg", "image/svg"]),
  maxSize(1024 * 1024 * 2),
]);

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
    const parsedAvatar = parse(FileSchema, data.avatar);

    const formData = new FormData();
    formData.append("avatar", parsedAvatar);
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
          sx={{
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
          }}
        />
        <TextFieldElement
          name={"name"}
          label={"Name"}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{ sx: { borderRadius: 0 } }}
          sx={{
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
          }}
        />
        <Typography>Upload Avatar</Typography>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <MuiFileInput
              {...field}
              inputProps={{ accept: ".png, .jpeg, .jpg, .svg" }}
              InputProps={{ sx: { borderRadius: 0 } }}
              placeholder="Insert a file"
              sx={{
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
              }}
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
