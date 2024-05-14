import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import About from "./components/About";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import User from "./components/User";
import Users from "./components/Users";
import Movie from "./components/Movie";
import NotificationAlert from "./components/Notification";
import loginService from "./services/login";
import userService from "./services/users";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import TestImageForm from "./components/TestImageForm";

function App() {
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const dispatch = useNotificationDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedKinologyUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      userService.setToken(user.token);
    }
  }, []);

  console.log(user);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const removeUser = (userId) => {
    try {
      setUsers(users.filter((user) => user.id !== userId));

      dispatch({
        type: "SHOW",
        payload: {
          message: "User deleted",
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when deleting user`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  // movie buttons continues here
  const handleMovieButton = async (event, button, movie) => {
    // do i even need event here? check again after everything else works
    event.preventDefault();
    try {
      const currentUserId = users.find((u) => u.username === user.username)?.id;
      console.log(movie, button, currentUserId);
      await userService.addMovieToProfile(movie, button, currentUserId);
      dispatch({
        type: "SHOW",
        payload: {
          message: `Successfully added ${movie.title} to ${button}`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when adding a movie to your profile`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const handleMovieButtonUnpress = async (event, button, movie) => {
    // do i even need event here? check again after everything else works
    event.preventDefault();
    try {
      const currentUserId = users.find((u) => u.username === user.username)?.id;
      await userService.removeMovieFromProfile(movie, button, currentUserId);
      dispatch({
        type: "SHOW",
        payload: {
          message: `Successfully removed movie from your profile`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when removing a movie from your profile`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const handleLogin = async (data) => {
    console.log(data);
    const { username, password } = data;

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedKinologyUser", JSON.stringify(user));
      userService.setToken(user.token);

      dispatch({
        type: "SHOW",
        payload: {
          message: `Successfully logged in`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);

      setUser(user);
      navigate("/");
    } catch (exception) {
      console.log("wrong credentials");
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when logging in`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  return (
    <>
      <Navigation user={user} />
      <NotificationAlert />
      <Routes>
        <Route
          path="/users/:id"
          element={<User currentUser={user} removeUser={removeUser} />}
        />
        <Route
          path="/"
          element={
            <LandingPage
              onButtonPress={handleMovieButton}
              onButtonUnpress={handleMovieButtonUnpress}
              user={user}
            />
          }
        />
        <Route
          path="/movies/:id"
          element={
            <Movie
              onButtonPress={handleMovieButton}
              onButtonUnpress={handleMovieButtonUnpress}
              user={user}
            />
          }
        />
        <Route
          path="/signup"
          element={<SignUp user={user} users={users} setUsers={setUsers} />}
        />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/users"
          element={<Users users={users} removeUser={removeUser} />}
        />
        <Route path="/testimage" element={<TestImageForm />} />
      </Routes>
    </>
  );
}

export default App;
