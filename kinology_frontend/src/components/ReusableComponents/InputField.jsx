import { TextFieldElement } from "react-hook-form-mui";
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

const InputField = ({ name, label, control }) => {
  return (
    <TextFieldElement
      name={name}
      label={label}
      fullWidth
      control={control}
      margin={"dense"}
      InputProps={{ sx: { borderRadius: 0 } }}
      sx={textInputStyle}
    />
  );
};

export default InputField;

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};
