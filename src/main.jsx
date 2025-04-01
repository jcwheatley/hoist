import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WorkoutProvider } from "./context/WorkoutContext.jsx";
import { PlanProvider } from "./context/PlanContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlanProvider>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </PlanProvider>
  </StrictMode>
);
