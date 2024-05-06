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
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
