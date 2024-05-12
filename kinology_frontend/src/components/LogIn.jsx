import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength, endsWith } from "valibot";

// email /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const LoginSchema = object({
  username: string("Username must be a string.", [
    minLength(1, "Please enter your username."),
    minLength(3, "Username needs to be at least 3 characters long."),
  ]),
  password: string("Your password must be a string.", [
    minLength(1, "Password is required."),
    minLength(6, "Your password must have 6 characters or more."),
  ]),
});

const LogIn = ({ handleLogin }) => {
  //   const navigate = useNavigate();

  //   // this needs to be changed
  //   if (user) navigate("/");
  //   return (
  //     <div>
  //       <h1>Log In</h1>
  //       <form onSubmit={handleSubmit}>
  //         <div>
  //           username:{" "}
  //           <input
  //             type="text"
  //             value={username}
  //             onChange={handleUsernameChange}
  //             name="Username"
  //             autoComplete="username"
  //           />
  //         </div>
  //         <div>
  //           password:{" "}
  //           <input
  //             type="password"
  //             value={password}
  //             onChange={handlePasswordChange}
  //             name="Password"
  //             autoComplete="current-password"
  //           />
  //         </div>
  //         <button type="submit">log in</button>
  //       </form>
  //     </div>
  //   );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: valibotResolver(LoginSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ username: "", password: "" });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div>
        username
        <input {...register("username")} />
        <p style={{ color: "red" }}>{errors.username?.message}</p>
      </div>
      <div>
        password
        <input type="password" {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};

export default LogIn;
