import { useNavigate } from "react-router-dom";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import signUpService from "../services/signup";
import SignUpForm from "./SignUpForm";
import PropTypes from "prop-types";

const SignUp = ({ setUsers, users }) => {
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();

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

  return <SignUpForm handleSignUp={handleSignUp} />;
};

export default SignUp;

SignUp.propTypes = {
  setUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
