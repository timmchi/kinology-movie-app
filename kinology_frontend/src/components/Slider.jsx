import { SliderElement } from "react-hook-form-mui";

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
