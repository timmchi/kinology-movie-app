import { useEffect } from "react";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { TextFieldElement } from "react-hook-form-mui";
import Fab from "@mui/material/Fab";
import { InputAdornment } from "@mui/material";

const textInputStyle = {
  margin: 5,
  backgroundColor: "rgba(206, 202, 182, 0.5)",
  label: { color: "white" },
  input: {
    color: "white",
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

const SearchByTitleBar = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const logData = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(logData)}>
      <div className="title-search-bar">
        <TextFieldElement
          name={"title"}
          label={"Search by title"}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{
            sx: { borderRadius: 0 },
            endAdornment: (
              <InputAdornment position="end">
                <Fab
                  size="small"
                  type="submit"
                  sx={{ opacity: "0.7" }}
                  disabled={isSubmitting}
                >
                  <SearchIcon />
                </Fab>
              </InputAdornment>
            ),
          }}
          sx={textInputStyle}
        />
      </div>
    </form>
  );
};

export default SearchByTitleBar;
