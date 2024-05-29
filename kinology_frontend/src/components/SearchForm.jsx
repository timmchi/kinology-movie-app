import { Controller } from "react-hook-form";

import genreOptions from "../data/genres";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import SearchButton from "./SearchButton";
import Slider from "./Slider";
import InputField from "./InputField";
import Stack from "@mui/joy/Stack";
import { Typography } from "@mui/material";

const components = {
  DropdownIndicator: null,
};

const reactSelectStyles = {
  control: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: "inherit",
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

const SearchForm = ({
  control,
  handleKeyDown,
  isSubmitting,
  actor,
  actors,
  setActor,
  setActors,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
          <InputField name={"director"} label={"Director"} control={control} />
          <InputField name={"year"} label={"Year"} control={control} />
          <div>
            <Typography sx={{ paddingBottom: "0.5em", color: "#0A6847" }}>
              Rating range
            </Typography>
            <Slider
              name="ratingLower"
              label="Lower threshold"
              control={control}
            />
            <Slider
              name="ratingUpper"
              label="Upper threshold"
              control={control}
            />
          </div>
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
          <InputField name={"country"} label={"Country"} control={control} />
        </div>
        <SearchButton
          isSubmitting={isSubmitting}
          label={"Search for movies"}
          submittingText={"Searching..."}
          normalText={"Search"}
        />
      </Stack>
    </form>
  );
};

export default SearchForm;
