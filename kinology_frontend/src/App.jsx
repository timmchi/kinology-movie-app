import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import About from "./components/About/About";
import LogIn from "./components/Auth/LogIn";
import SignUp from "./components/SignUp/SignUp";
import SignUpForm from "./components/SignUp/SignUpForm";
import User from "./components/User/User";
import Users from "./components/User/Users";
import Test from "./components/Test";
import Movie from "./components/Movie/Movie";
import NotificationAlert from "./components/Notification/Notification";
import loginService from "./services/login";
import userService from "./services/users";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import { Navigate } from "react-router-dom";

function App() {
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

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const addUser = (user) => {
    setUsers(users.concat(user));
  };

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
      dispatch({
        type: "SHOW",
        payload: {
          message: `${exception.response.data.error}`,
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
          element={
            // <SignUp
            //   user={user}
            //   users={users}
            //   setUsers={setUsers}
            //   addUser={addUser}
            // />
            <SignUpForm addUser={addUser} />
          }
        />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/users"
          element={<Users users={users} removeUser={removeUser} />}
        />
        <Route
          path="/me"
          element={
            user !== null ? (
              <Navigate replace to={`/users/${user.id}`} />
            ) : (
              <LogIn handleLogin={handleLogin} />
            )
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
