// links to implement = /movie/:id, /user/:id

import { Link, NavLink } from "react-router-dom";

const Navigation = ({ user = null }) => {
  const padding = {
    padding: 5,
  };

  return (
    <div>
      <nav className="nav">
        <Link style={padding} to="/" className="site-title">
          Home
        </Link>
        <ul>
          <li>
            <NavLink style={padding} to="/about">
              About
            </NavLink>
          </li>
          {user ? (
            <li>
              <NavLink style={padding} to="/logout">
                Log out
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink style={padding} to="/login">
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink style={padding} to="/signup">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
