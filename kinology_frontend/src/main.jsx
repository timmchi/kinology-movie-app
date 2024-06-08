import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationContextProvider } from "./contexts/NotificationContext.jsx";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import "./styles.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <UserContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </UserContextProvider>
  </Router>
);
