import { useEffect } from "react";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { TextFieldElement } from "react-hook-form-mui";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment } from "@mui/material";
import moviesService from "../../services/movies";
import PropTypes from "prop-types";

const textInputStyle = {
  marginLeft: "3em",
  marginRight: "3em",
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

// this component does not have that much logic as it returns maximum of 20 movies and thus doesnt use pagination, which is why I felt like there was no need to move logic to a hook the way it is done in the searchform and searchmodal.
// the reason for only returning 20 movies is that if a person is searching a movie by title, they know what they are looking for and will thus be satisfied with one of the first options in the list (TMDB returns movies based on popularity)
const SearchByTitleBar = ({ setMovies }) => {
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

  const searchMovie = async (data) => {
    const movies = await moviesService.searchByTitle(data);
    setMovies(movies);
  };

  // this is separate from clear search which can is used to clear SearchForm component. Both clear the movies list though
  const resetForm = () => {
    reset({
      title: "",
    });
    setMovies([]);
  };

  return (
    <form onSubmit={handleSubmit(searchMovie)}>
      <div className="title-search-bar">
        <TextFieldElement
          name={"title"}
          label={"Search by title"}
          fullWidth
          control={control}
          margin={"dense"}
          InputProps={{
            sx: {
              borderRadius: 0,
            },
            endAdornment: (
              <InputAdornment position="end">
                <Button sx={{ color: "white" }} onClick={resetForm}>
                  <ClearIcon sx={{ opacity: "0.7" }} />
                </Button>
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

SearchByTitleBar.propTypes = {
  setMovies: PropTypes.func.isRequired,
};
