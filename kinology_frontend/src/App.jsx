import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import About from "./components/About";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import User from "./components/User";
import Users from "./components/Users";
import Movie from "./components/Movie";
import loginService from "./services/login";
import userService from "./services/users";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedKinologyUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      userService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const handleMovieButton = async (event, button, movieId) => {
    event.preventDefault();
    // try {
    const currentUserId = users.find((u) => u.username === user.username)?.id;
    console.log(movieId, button, currentUserId);
    await userService.addMovieToProfile(movieId, button, currentUserId);
    // } catch (exception) {
    //   console.log("somewhing went wrong when adding a movie to your profile");
    // }
  };

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
        <Route
          path="/movies/:id"
          element={<Movie onButtonPress={handleMovieButton} user={user} />}
        />
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
        <Route path="/users" element={<Users users={users} />} />
      </Routes>
    </>
  );
}

export default App;
