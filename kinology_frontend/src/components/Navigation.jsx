// links to implement = /movie/:id, /user/:id

import { Link } from "react-router-dom";

const Navigation = ({ user = null }) => {
  const padding = {
    padding: 5,
  };

  return (
    <div>
      {/* <Link style={padding} to="/">
        Home
      </Link> */}
      {/* <Link style={padding} to="/about">
        About
      </Link>

      {user ? (
        <Link style={padding} to="/logout">
          Log out
        </Link>
      ) : (
        <>
          <Link style={padding} to="/login">
            Log in
          </Link>
          <Link style={padding} to="/signup">
            Sign up
          </Link>
        </>
      )} */}
      <nav className="nav">
        <Link style={padding} to="/" className="site-title">
          Home
        </Link>
        <ul>
          <li>
            <Link style={padding} to="/about">
              About
            </Link>
          </li>
          {user ? (
            <li>
              <Link style={padding} to="/logout">
                Log out
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link style={padding} to="/login">
                  Log in
                </Link>
              </li>
              <li>
                <Link style={padding} to="/signup">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
