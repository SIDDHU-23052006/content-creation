import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDatabaseSync } from "./services/dbSync";

// Initialize local storage synchronizer with SQLite database
initDatabaseSync();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
