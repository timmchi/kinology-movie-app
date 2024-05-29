import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Button from "@mui/material/Button";
import Stack from "@mui/joy/Stack";
import { TextFieldElement, SliderElement } from "react-hook-form-mui";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import genreOptions from "../data/genres";

import {
  object,
  string,
  minLength,
  array,
  literal,
  union,
  minValue,
  maxValue,
  number,
  maxLength,
  optional,
} from "valibot";
import { Typography } from "@mui/material";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

// TODO = find a way to style the errors better

const searchQuerySchema = object({
  genresSelect: optional(
    array(
      object({
        label: string("Genre label should be a string"),
        value: number("Genre value should be a number"),
      })
    )
  ),
  year: union([
    string([
      minValue("1874", "Movies can not be shot before 1874"),
      maxValue(
        `${new Date().getFullYear()}`,
        "Can not search for movies shot after current year"
      ),
    ]),
    literal(""),
  ]),
  ratingUpper: number("Rating should be a number", [
    minValue(0, "Rating can not be lower than 0"),
    maxValue(10, "Rating can not be higher than 10"),
  ]),
  ratingLower: number("Rating should be a number", [
    minValue(0, "Rating can not be lower than 0"),
    maxValue(11, "Rating can not be higher than 10"),
  ]),
  country: string("Country should be a string", [
    maxLength(100, "Country name can not be this long"),
  ]),
  director: string("Director should be a string"),
});

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

const reactSelectStyles = {
  control: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: "inherit",
    // borderColor: state.isFocused ? "#bdac4e" : "#397453",
    borderColor: isFocused ? "#bdac4e" : "#0A6847",
    borderWidth: isFocused ? "2px" : "1px",
    boxShadow: "60px teal",
    borderRadius: 0,
    padding: "0.6em 0em",
    "&:hover": {
      borderColor: "#609b76",
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#0A6847",
    fontWeight: 400,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles) => ({
    ...styles,
    color: "#0A6847",
  }),
};

const Test = () => {
  const [open, setOpen] = useState(false);
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: valibotResolver(searchQuerySchema),
    defaultValues: {
      genresSelect: [],
      director: "",
      year: "",
      ratingLower: 0,
      ratingUpper: 10,
      country: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ bio: "", name: "", avatar: null });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleKeyDown = (event) => {
    if (!actor) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setActors((prev) => [...prev, createOption(actor)]);
        setActor("");
        event.preventDefault();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#609b76",
          "&:hover": { backgroundColor: "#00532f" },
          marginBottom: 1,
        }}
      >
        Open Search
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: 650,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            bgcolor: "#F6E9B2",
          }}
        >
          <ModalClose variant="plain" sx={{ marginLeft: 1 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1} sx={{ padding: "1em" }}>
              <div>
                <Controller
                  name="genresSelect"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      styles={reactSelectStyles}
                      options={genreOptions}
                      menuPortalTarget={document.body}
                      isMulti
                      placeholder="Select genres"
                    />
                  )}
                />
              </div>
              {errors.genresSelect?.message ?? (
                <p className="validation-error">
                  {errors.genresSelect?.message}
                </p>
              )}

              <TextFieldElement
                name={"director"}
                label={"Director"}
                fullWidth
                control={control}
                margin={"dense"}
                InputProps={{ sx: { borderRadius: 0 } }}
                sx={textInputStyle}
              />
              <div>
                <TextFieldElement
                  name={"year"}
                  label={"Year"}
                  fullWidth
                  control={control}
                  margin={"dense"}
                  InputProps={{ sx: { borderRadius: 0 } }}
                  sx={textInputStyle}
                />
              </div>
              <div>
                <Typography sx={{ paddingBottom: "0.5em", color: "#0A6847" }}>
                  Rating range
                </Typography>
                <SliderElement
                  name="ratingLower"
                  label="Lower threshold"
                  control={control}
                  sx={{
                    color: "#609b76",
                  }}
                  max={10}
                  min={0}
                  marks
                  valueLabelDisplay="auto"
                />
                <SliderElement
                  name="ratingUpper"
                  label="Upper threshold"
                  control={control}
                  sx={{ color: "#609b76" }}
                  max={10}
                  min={0}
                  marks
                  valueLabelDisplay="auto"
                />
              </div>
              <div data-testid="actor-input">
                <Controller
                  name="actorsSelect"
                  control={control}
                  render={({ field }) => (
                    <CreatableSelect
                      {...field}
                      components={components}
                      options={genreOptions}
                      inputValue={actor}
                      isMulti
                      isClearable
                      menuIsOpen={false}
                      placeholder="Type in actor and press enter"
                      onChange={(newActor) => setActors(newActor)}
                      onInputChange={(newActor) => setActor(newActor)}
                      onKeyDown={handleKeyDown}
                      value={actors}
                      styles={reactSelectStyles}
                    />
                  )}
                />
              </div>
              <div>
                <TextFieldElement
                  name={"country"}
                  fullWidth
                  label={"Country"}
                  InputProps={{ sx: { borderRadius: 0 } }}
                  control={control}
                  sx={textInputStyle}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-label="Search for movies"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#609b76",
                  "&:hover": { backgroundColor: "#00532f" },
                  marginBottom: 1,
                }}
              >
                {isSubmitting ? "Searching..." : "Search"}
              </Button>
            </Stack>
          </form>
        </Sheet>
      </Modal>
    </>
  );
};

export default Test;
