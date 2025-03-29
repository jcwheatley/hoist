import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Workout from "@/pages/Workout";
import ViewWorkout from "@/pages/ViewWorkout";
import GenerateWorkout from "@/pages/GenerateWorkout";
import Library from "@/pages/Library";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
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
          <Route
            path='/workout/ai'
            element={
              <ProtectedRoute>
                <Layout>
                  <GenerateWorkout />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/workout'
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
            path='/library'
            element={
              <ProtectedRoute>
                <Layout>
                  <Library />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
