import axios from "axios";

// Create API instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Error in request setup
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);
