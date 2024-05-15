import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

const UserUpdateForm = ({ updateUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ bio: "", name: "", avatar: null });
    }
  }, [isSubmitSuccessful, reset]);

  const updatingUser = (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
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
      </div>
      <div>
        Avatar
        <input {...register("avatar")} type="file" accept="image/*" />
      </div>
      <div>
        Name
        <input {...register("name")} placeholder="Change your name" />
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Updating..." : "Update your profile"}
      </button>
    </form>
  );
};

export default UserUpdateForm;
