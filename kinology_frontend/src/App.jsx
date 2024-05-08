import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import About from "./components/About";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import User from "./components/User";
import Movie from "./components/Movie";
import loginService from "./services/login";
import userService from "./services/users";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  //   const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedKinologyUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      userService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedKinologyUser", JSON.stringify(user));
      userService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("wrong credentials");
    }
  };

  return (
    <>
      <Navigation user={user} />
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/signup" element={<SignUp user={user} />} />
        <Route
          path="/login"
          element={
            <LogIn
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
              user={user}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
