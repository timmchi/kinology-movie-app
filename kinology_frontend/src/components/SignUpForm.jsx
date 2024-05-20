import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength, forward, custom, email } from "valibot";

const RegistrationSchema = object(
  {
    email: string([
      minLength(1, "Please enter your email."),
      email("The email address is badly formatted"),
    ]),
    username: string([
      minLength(1, "Please enter your username."),
      minLength(3, "Username should be 3 or more symbols"),
    ]),
    name: string([
      minLength(1, "Please enter your name or nickname."),
      minLength(3, "Name or nickname should be 3 or more symbols"),
    ]),
    password: string([
      minLength(1, "Please enter your password."),
      minLength(6, "Your password must have 6 characters or more."),
    ]),
    passwordConfirm: string([minLength(1, "Please confirm password")]),
  },
  [
    forward(
      custom(
        (input) => input.password === input.passwordConfirm,
        "The two passwords do not match"
      ),
      ["passwordConfirm"]
    ),
  ]
);

const SignUpForm = ({ handleSignUp }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: valibotResolver(RegistrationSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="credentialsForm">
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div>
          username
          <input {...register("username")} placeholder="username" />
          <p style={{ color: "red" }}>{errors.username?.message}</p>
        </div>
        <div>
          email
          <input {...register("email")} placeholder="email" />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </div>
        <div>
          name
          <input {...register("name")} placeholder="name" />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>
        <div>
          password
          <input
            type="password"
            {...register("password")}
            placeholder="password"
          />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </div>
        <div>
          confirm password
          <input
            type="password"
            {...register("passwordConfirm")}
            placeholder="confirm password"
          />
          <p style={{ color: "red" }}>{errors.passwordConfirm?.message}</p>
        </div>
        <button disabled={isSubmitting} type="submit" id="signup-button">
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
