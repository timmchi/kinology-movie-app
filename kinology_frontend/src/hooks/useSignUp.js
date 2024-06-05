import { useNavigate } from "react-router-dom";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import signUpService from "../services/signup";

const useSignUp = (addUser) => {
  const navigate = useNavigate();
  const dispatch = useNotificationDispatch();

  const handleSignUp = async (data) => {
    const { username, email, password, passwordConfirm, name } = data;

    try {
      const user = await signUpService.signUp({
        username,
        email,
        password,
        passwordConfirm,
        name,
      });
      addUser(user);
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

  return {
    handleSignUp,
  };
};

export default useSignUp;
