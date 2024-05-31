import { SliderElement } from "react-hook-form-mui";
import PropTypes from "prop-types";

const Slider = ({ name, label, control }) => {
  return (
    <SliderElement
      name={name}
      label={label}
      control={control}
      sx={{
        color: "#609b76",
      }}
      max={10}
      min={0}
      marks
      valueLabelDisplay="auto"
    />
  );
};

export default Slider;

Slider.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};
