import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import About from "./components/About";
import LogIn from "./components/LogIn";
import LogOut from "./components/LogOut";
import SignUp from "./components/SignUp";
import User from "./components/User";
import Movie from "./components/Movie";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
  };
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/login"
          element={
            <LogIn
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          }
        />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
