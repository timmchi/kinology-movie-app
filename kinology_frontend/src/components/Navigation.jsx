// links to implement = /movie/:id, /user/:id

import { Link, NavLink } from "react-router-dom";
import LogOut from "./LogOut";

const Navigation = ({ user }) => {
  const padding = {
    padding: 5,
  };

  const handleLogout = (event) => {
    console.log("logging out...");
    window.localStorage.removeItem("loggedKinologyUser");
    window.location.reload();
  };

  return (
    <div>
      <nav className="nav">
        <Link style={padding} to="/" className="site-title">
          Kinology
        </Link>
        <ul>
          <li>
            <NavLink style={padding} to="/about">
              About
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink style={padding} to="/users">
                  Users
                </NavLink>
              </li>
              <li>
                <LogOut handleLogout={handleLogout} />
              </li>
            </>
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
