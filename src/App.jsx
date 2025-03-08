import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./components/shared/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import UsersPage from "./pages/UsersPage";
import WeatherPage from "./pages/WeatherPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

// Set up axios defaults
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token");
        }

        // Set token in axios defaults
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Verify token with backend
        const response = await axios.get("http://localhost:3000/api/auth/me");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, []);

  if (isVerifying) {
    return <div className="p-6">Loading...</div>; // You can replace this with a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // If it's the login page, render only the LoginPage component
  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Background with blur */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 relative overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ships"
              element={
                <ProtectedRoute>
                  <ShipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <WeatherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
