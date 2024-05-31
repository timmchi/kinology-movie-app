import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { Link } from "react-router-dom";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import PropTypes from "prop-types";

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
    <div style={{ backgroundColor: "#397453" }}>
      <Box
        sx={{
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": { display: "flex", flexDirection: "column", gap: 2 },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3" sx={{ color: "#f7e382" }}>
                  Log in
                </Typography>
                <Typography level="body-sm" sx={{ color: "#f7e382" }}>
                  New to Kinology?{" "}
                  <Link to="/signup" sx={{ color: "#E6E9E0" }}>
                    Create an account
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ bgcolor: "#bdac4e" }} />
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit(handleLogin)}>
                <FormControl>
                  <FormLabel sx={{ color: "#f7e382" }}>Username</FormLabel>
                  <Input
                    {...register("username")}
                    placeholder="username..."
                    data-testid="username"
                  />
                  {errors?.username?.message ? (
                    <p style={{ color: "red" }}>{errors.username?.message}</p>
                  ) : null}
                </FormControl>
                <FormControl>
                  <FormLabel sx={{ color: "#f7e382" }}>Password</FormLabel>
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="password..."
                    data-testid="password"
                  />
                  {errors?.password?.message ? (
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                  ) : null}
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  id="login-button"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1589053739346-ed32227546a4?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      />
    </div>
  );
};

export default LogIn;

LogIn.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
