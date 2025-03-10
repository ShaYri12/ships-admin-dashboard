import axios from "axios";

// Create API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
const handleApiError = (error) => {
  console.error("API Error:", error);
  throw error;
};

export { api, handleApiError };
