import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import { useAuth, AuthProvider } from "./context/AuthContext";

import Loader from "./components/Loading";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />

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
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </div>
          }
        />
      )}

      {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
      {user && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
