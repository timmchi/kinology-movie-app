import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
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

const UserUpdateSchema = object(
  {
    bio: string("About me should be a string", [
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ resolver: valibotResolver(UserUpdateSchema) });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ bio: "", name: "", avatar: null });
    }
  }, [isSubmitSuccessful, reset]);

  const updatingUser = (data) => {
    const parsedAvatar = parse(FileSchema, data.avatar[0]);

    const formData = new FormData();
    formData.append("avatar", parsedAvatar);
    formData.append("bio", data.bio);
    formData.append("name", data.name);

    console.log(formData.get("avatar"));
    updateUser(formData);
  };

  return (
    <form onSubmit={handleSubmit(updatingUser)}>
      <div>
        About you
        <input
          {...register("bio")}
          placeholder="Write something about yourself"
        />
        <div className="formError">
          {errors.bio?.message ?? <p>{errors.bio?.message}</p>}
        </div>
      </div>
      <div>
        Avatar
        <input {...register("avatar")} type="file" accept="image/*" />
      </div>
      <div>
        Name
        <input {...register("name")} placeholder="Change your name" />
        <div className="formError">
          {errors.name?.message ?? <p>{errors.name?.message}</p>}
        </div>
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Updating..." : "Update your profile"}
      </button>
    </form>
  );
};

export default UserUpdateForm;
