import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
          borderRadius: "10px",
        },
      }}
    />
    <App />
  </React.StrictMode>
);