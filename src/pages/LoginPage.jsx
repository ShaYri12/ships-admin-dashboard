import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Ship, Lock } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // Verify token validity with backend
      axios
        .get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        })
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          // If token is invalid, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, ...userData } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on role and status
      if (userData.status !== "active") {
        setError("Your account is inactive. Please contact an administrator.");
        return;
      }

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      // Clear any invalid tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4 z-10"
      >
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex justify-center mb-8">
            <Ship className="w-12 h-12 text-indigo-500" />
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Ships Dashboard Login
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
