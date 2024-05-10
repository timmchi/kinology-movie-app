import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./contexts/NotificationContext.jsx";
import "./styles.css";
import App from "./App.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </QueryClientProvider>
  </Router>
);
