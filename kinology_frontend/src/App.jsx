import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import About from "./components/About/About";
import LogIn from "./components/Auth/LogIn";
import SignUpForm from "./components/SignUp/SignUpForm";
import User from "./components/User/User";
import Users from "./components/User/Users";
import Test from "./components/Test";
import Movie from "./components/Movie/Movie";
import NotificationAlert from "./components/Notification/Notification";
import loginService from "./services/login";
import userService from "./services/users";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import { useUserDispatch, useUserValue } from "./contexts/UserContext";
import AuthVerify from "./common/AuthVerify";
import { Navigate } from "react-router-dom";

const App = () => {
  const [users, setUsers] = useState([]);
  const user = useUserValue();
  const dispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();
  const navigate = useNavigate();

  // checks if the user is in local storage, if so - logs in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedKinologyUser");
    if (loggedUserJSON && loggedUserJSON != null) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({
        type: "LOGIN",
        payload: user,
      });
      userService.setToken(user.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this is used in AuthVerify component, it is called when the page changes. If the user token has expired, user is asked to log in again
  const logOut = useCallback(() => {
    userDispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("loggedKinologyUser");

    dispatch({
      type: "SHOW",
      payload: {
        message: "Your session has run out, please log in again",
        type: "success",
      },
    });
    setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  // This function is used in signing up
  const addUser = (user) => {
    setUsers(users.concat(user));
  };

  // Used in User component
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

  // This handles pressing one of the three movie buttons (watch, seen, favorite)
  const handleMovieButton = async (event, button, movie) => {
    event.preventDefault();
    try {
      const currentUserId = users.find((u) => u.username === user.username)?.id;
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

  // This handles the opposite press of one of the three movie buttons (unwatch, unsee, unfavorite)
  const handleMovieButtonUnpress = async (event, button, movie) => {
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
    const { username, password } = data;

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedKinologyUser", JSON.stringify(user));
      userService.setToken(user.token);

      userDispatch({
        type: "LOGIN",
        payload: user,
      });
      dispatch({
        type: "SHOW",
        payload: {
          message: `Successfully logged in`,
          type: "success",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      navigate("/");
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: `Something went wrong when logging in: ${exception.response.data.error}`,
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  return (
    <>
      <Navigation />
      <NotificationAlert />
      <Routes>
        <Route path="/users/:id" element={<User removeUser={removeUser} />} />
        <Route
          path="/"
          element={
            <LandingPage
              onButtonPress={handleMovieButton}
              onButtonUnpress={handleMovieButtonUnpress}
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
        <Route path="/signup" element={<SignUpForm addUser={addUser} />} />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/users"
          element={
            user ? (
              <Users users={users} removeUser={removeUser} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/me"
          element={
            // if the user is logged in, do a basic user page with current user id, then inside of the User component useParams handles rendering the correct user. Otherwise, sends to log in
            user !== null ? (
              <Navigate replace to={`/users/${user.id}`} />
            ) : (
              <LogIn handleLogin={handleLogin} />
            )
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>

      <AuthVerify logOut={logOut} />
    </>
  );
};

export default App;
