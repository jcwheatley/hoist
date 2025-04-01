import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom"; // Add Outlet
import toast, { ToastBar, Toaster } from "react-hot-toast";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Workout from "@/pages/Workout";
import ViewWorkout from "@/pages/ViewWorkout";
import GenerateWorkout from "@/pages/GenerateWorkout";
import Library from "@/pages/Library";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// Plan setup pages
import PlanIntro from "@/pages/PlanSetup/PlanIntro";
import PlanFrequency from "@/pages/PlanSetup/PlanFrequency";
import PlanEquipment from "@/pages/PlanSetup/PlanEquipment";
import PlanGoal from "@/pages/PlanSetup/PlanGoal";
import PlanLength from "@/pages/PlanSetup/PlanLength";
import PlanNotes from "@/pages/PlanSetup/PlanNotes";
import PlanPreview from "@/pages/PlanSetup/PlanPreview";

// Wrapper for protected routes with layout
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>
      {children || <Outlet />} {/* Use Outlet for nested routes */}
    </Layout>
  </ProtectedRoute>
);

// Define main app routes
const mainRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/workout/ai", element: <GenerateWorkout /> },
  { path: "/workout", element: <Workout /> },
  { path: "/library", element: <Library /> },
  { path: "/profile", element: <Profile /> },
];

// Define plan setup routes
const planRoutes = [
  { path: "", element: <PlanIntro /> }, // Base /plan route
  { path: "frequency", element: <PlanFrequency /> },
  { path: "equipment", element: <PlanEquipment /> },
  { path: "goal", element: <PlanGoal /> },
  { path: "length", element: <PlanLength /> },
  { path: "notes", element: <PlanNotes /> },
  { path: "preview", element: <PlanPreview /> },
];

export default function App() {
  return (
    <>
      {/* <Toaster  /> */}
      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/workout/:id' element={<ViewWorkout />} />

          {/* Protected Routes with Layout */}
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedLayout>{route.element}</ProtectedLayout>}
            />
          ))}

          {/* Nested Plan Setup Routes */}
          <Route path='/plan' element={<ProtectedLayout />}>
            {planRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
      </Router>
    </>
  );
}
