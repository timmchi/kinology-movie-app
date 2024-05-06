import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import About from "./components/About";
import LogIn from "./components/LogIn";
import LogOut from "./components/LogOut";
import SignUp from "./components/SignUp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Beginning of kinology!</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Navigation />
      <Routes>
        <Route path="/users/:id" />
        <Route path="/" element={<LandingPage />} />
        <Route path="/movie/:id" />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
