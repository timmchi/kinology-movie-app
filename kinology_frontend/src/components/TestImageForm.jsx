import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const TestImageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const submitForm = async (data) => {
    const formData = new FormData();

    formData.append("picture", data.picture[0]);
    await axios.post("http://localhost:3001/api/users/test", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div>
      <p>image form </p>
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          picture
          <input
            {...register("picture", {
              required: "picture is required",
            })}
            type="file"
            id="picture"
          />
          {/* <Controller
            control={control}
            name={"picture"}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <input
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }}
                  type="file"
                  id="picture"
                />
              );
            }}
          /> */}
        </div>
        <button type="submit">submit image</button>
      </form>
    </div>
  );
};

export default TestImageForm;
