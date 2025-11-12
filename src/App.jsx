import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loading";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import OneDriveAuthCallback from "./pages/OneDriveAuthCallback";
import './theme/root.css' 

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Teams = lazy(() => import("./pages/Teams"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectMgmt = lazy(() => import("./pages/projectmgmt"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* OAuth Callbacks - Public routes */}
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/auth/onedrive/callback" element={<OneDriveAuthCallback />} />

        {/* Public route */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        {/* Protected routes */}
        {user && (
          <Route
            path="*"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project/:projectId" element={<ProjectMgmt />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            }
          />
        )}

        {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}