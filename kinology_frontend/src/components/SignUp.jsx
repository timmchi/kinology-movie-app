import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength, forward, custom, email } from "valibot";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import signUpService from "../services/signup";

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

const SignUp = ({ user, setUsers, users }) => {
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();

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

  const handleSignUp = async (data) => {
    console.log(data);
    const { username, email, password, passwordConfirm, name } = data;

    try {
      const user = await signUpService.signUp({
        username,
        email,
        password,
        passwordConfirm,
        name,
      });
      setUsers(users.concat(user));
      dispatch({
        type: "SHOW",
        payload: {
          message: "Sign up was successful, please log in",
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      navigate("/login");
    } catch (exception) {
      console.log(exception);
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when signing up",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <div>
        username
        <input {...register("username")} />
        <p style={{ color: "red" }}>{errors.username?.message}</p>
      </div>
      <div>
        email
        <input {...register("email")} />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>
      <div>
        Name
        <input {...register("name")} />
        <p style={{ color: "red" }}>{errors.name?.message}</p>
      </div>
      <div>
        password
        <input type="password" {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>
      <div>
        Confirm password
        <input type="password" {...register("passwordConfirm")} />
        <p style={{ color: "red" }}>{errors.passwordConfirm?.message}</p>
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
