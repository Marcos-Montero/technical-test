import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { UserDashboard } from "./app/user-dashboard/user-dashboard";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <UserDashboard />
  </React.StrictMode>,
);
