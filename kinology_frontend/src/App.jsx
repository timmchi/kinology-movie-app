import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";

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
        <Route path="/signup" />
        <Route path="/login" />
        <Route path="/logout" />
        <Route path="/about" />
      </Routes>
    </>
  );
}

export default App;
