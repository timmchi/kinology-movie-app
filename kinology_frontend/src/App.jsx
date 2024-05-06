import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

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
      <Routes>
        <Route path="/users/:id" />
        <Route path="/" />
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
