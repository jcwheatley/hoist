import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import NewWorkout from "./pages/NewWorkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ViewWorkout from "./pages/ViewWorkout";
import GenerateWorkout from "./pages/GenerateWorkout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* Wrap all protected pages with Layout */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path='/workouts/ai' element={<GenerateWorkout />} />
        <Route
          path='/workouts'
          element={
            <ProtectedRoute>
              <Layout>
                <Workout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path='/workout/:id' element={<ViewWorkout />} />{" "}
        <Route
          path='/workouts/new'
          element={
            <ProtectedRoute>
              <Layout>
                <NewWorkout />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
