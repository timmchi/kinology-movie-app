import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// decodes the token on page change and decodes the token to see if it has expired. Source: https://www.bezkoder.com/react-logout-token-expired/
const AuthVerify = (props) => {
  let location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedKinologyUser"));

    if (user) {
      const decodedToken = parseJwt(user.token);

      if (decodedToken.exp * 1000 < Date.now()) props.logOut();
    }
  }, [location, props]);

  return;
};

export default AuthVerify;
