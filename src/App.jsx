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

const WarningScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <svg className="w-24 h-24 mx-auto mb-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Under Review</h1>
      <p className="text-lg text-gray-700 mb-4">
        This Dashboard is still under review by Google API and Services.
      </p>
      <p className="text-gray-700">
        Please refer to{' '}
        <a 
          href="https://docs.jomnam.tech/image-annotation/legacy-version" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Legacy Version
        </a>
      </p>
    </div>
  </div>
);

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
          <Route path="*" element={<WarningScreen />} />
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