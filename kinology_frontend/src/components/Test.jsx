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
import genreOptions from "../data/genres";

import SearchIcon from "@mui/icons-material/Search";

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

const Test = () => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} sx={{ padding: "5em" }}>
        <div>
          <Controller
            name="genresSelect"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderWidth: 0,
                    borderRadius: 10,
                  }),
                }}
                options={genreOptions}
                isMulti
                placeholder="Select genres"
              />
            )}
          />
        </div>
        {errors.genresSelect?.message ?? (
          <p className="validation-error">{errors.genresSelect?.message}</p>
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
          <p>Rating range</p>
          <SliderElement
            name="ratingLower"
            label="Lower threshold"
            control={control}
            max={10}
            min={0}
            marks
            valueLabelDisplay="auto"
          />
          <SliderElement
            name="ratingUpper"
            label="Upper threshold"
            control={control}
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
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderWidth: 0,
                  }),
                }}
              />
            )}
          />
        </div>
        <div>
          <TextFieldElement
            name={"country"}
            fullWidth
            label={"country"}
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
  );
};

export default Test;
