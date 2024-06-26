import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength, pipe } from "valibot";
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

const credentialsInputStyle = {
  bgcolor: "#79C094",
  input: {
    color: "white",
    textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
  },
  borderRadius: 0,
  padding: 1.5,
  "--Input-placeholderOpacity": 1,
  "--Input-focusedInset": "var(--any, )",
  "--Input-focusedThickness": "2px",
  "--Input-focusedHighlight": "#bdac4e !important",
  "&:focus-within": {
    borderColor: "#bdac4e",
  },
};

const outerBoxStyle = {
  width: { xs: "100%", md: "50vw" },
  transition: "width var(--Transition-duration)",
  transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
  position: "relative",
  zIndex: 1,
  display: "flex",
  justifyContent: "flex-end",
  backdropFilter: "blur(12px)",
  backgroundColor: "rgba(255 255 255 / 0.2)",
};

const imageBoxStyle = {
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
};

const middleBoxStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  width: "100%",
  px: 2,
};

const innerBoxStyle = {
  my: "auto",
  py: 2,
  pb: 5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: 400,
  maxWidth: "100%",
  mx: "auto",
  textShadow: "1px 1px 2px rgba(13, 4, 2, 1)",
  borderRadius: "sm",
  "& form": { display: "flex", flexDirection: "column", gap: 2 },
  [`& .MuiFormLabel-asterisk`]: {
    visibility: "hidden",
  },
};

const LoginSchema = object({
  username: pipe(
    string("Username must be a string."),
    minLength(1, "Please enter your username."),
    minLength(3, "Username needs to be at least 3 characters long.")
  ),
  password: pipe(
    string("Your password must be a string."),
    minLength(1, "Password is required."),
    minLength(6, "Your password must have 6 characters or more.")
  ),
});

const formLabelStyle = { color: "#f7e382", fontSize: 18 };

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
      <Box sx={outerBoxStyle}>
        <Box sx={middleBoxStyle}>
          <Box component="main" sx={innerBoxStyle}>
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3" sx={{ color: "#f7e382" }}>
                  Log in
                </Typography>
                <Typography level="body-sm" sx={formLabelStyle}>
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
                  <FormLabel sx={formLabelStyle}>Username</FormLabel>
                  <Input
                    {...register("username")}
                    placeholder="Your username"
                    data-testid="username"
                    sx={credentialsInputStyle}
                  />
                  {errors?.username?.message ? (
                    <p style={{ color: "red" }}>{errors.username?.message}</p>
                  ) : null}
                </FormControl>
                <FormControl>
                  <FormLabel sx={formLabelStyle}>Password</FormLabel>
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="Your password"
                    data-testid="password"
                    autoComplete="on"
                    sx={credentialsInputStyle}
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
                  sx={{ fontSize: 18 }}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box sx={imageBoxStyle} />
    </div>
  );
};

export default LogIn;

LogIn.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
