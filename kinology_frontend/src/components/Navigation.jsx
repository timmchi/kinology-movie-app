// links to implement = /movie/:id, /user/:id

import { Link } from "react-router-dom";

const Navigation = () => {
  const padding = {
    padding: 5,
  };

  return (
    <div>
      <Link style={padding} to="/">
        Home
      </Link>
      <Link style={padding} to="/about">
        About
      </Link>

      <Link style={padding} to="/login">
        Log in
      </Link>
      <Link style={padding} to="/signup">
        Sign up
      </Link>

      <Link style={padding} to="/logout">
        Log out
      </Link>
    </div>
  );
};

export default Navigation;
