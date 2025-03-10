import { api, handleApiError } from "./api";
import { MOCK_SHIPS, MOCK_DASHBOARD_STATS, MOCK_CHART_DATA } from "./mockData";

// Ship-related API calls
export const shipService = {
  // Get all ships
  getAllShips: async (isMockMode = true) => {
    if (isMockMode) {
      return MOCK_SHIPS;
    }

    try {
      const response = await api.get("/ships");
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data format received from API");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ships from API:", error);
      throw new Error(
        error.response?.data?.message ||
          "Unable to fetch ships data. Please check your connection or try again later."
      );
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (isMockMode = true) => {
    if (isMockMode) {
      return MOCK_DASHBOARD_STATS;
    }

    try {
      const response = await api.get("/dashboard/stats");
      if (!response.data) {
        throw new Error("Invalid dashboard stats received from API");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats from API:", error);
      throw new Error(
        error.response?.data?.message ||
          "Unable to fetch dashboard statistics. Please check your connection or try again later."
      );
    }
  },

  // Get chart data
  getChartData: async (isMockMode = true) => {
    if (isMockMode) {
      return MOCK_CHART_DATA;
    }

    try {
      const response = await api.get("/dashboard/charts");
      if (!response.data) {
        throw new Error("Invalid chart data received from API");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch chart data from API:", error);
      throw new Error(
        error.response?.data?.message ||
          "Unable to fetch chart data. Please check your connection or try again later."
      );
    }
  },

  // Get single ship by ID
  getShipById: async (id, isMockMode = true) => {
    if (isMockMode) {
      const ship = MOCK_SHIPS.find((ship) => ship.id === id);
      if (!ship) {
        throw new Error("Ship not found in mock data");
      }
      return ship;
    }

    try {
      const response = await api.get(`/ships/${id}`);
      if (!response.data) {
        throw new Error("Ship not found");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ship from API:", error);
      throw new Error(
        error.response?.data?.message ||
          "Unable to fetch ship details. Please check your connection or try again later."
      );
    }
  },

  // Update ship
  updateShip: async (id, data, isMockMode = true) => {
    if (isMockMode) {
      const ship = MOCK_SHIPS.find((ship) => ship.id === id);
      if (!ship) {
        throw new Error("Ship not found in mock data");
      }
      return { ...ship, ...data };
    }

    try {
      const response = await api.put(`/ships/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update ship:", error);
      throw new Error(
        error.response?.data?.message ||
          "Unable to update ship details. Please check your connection or try again later."
      );
    }
  },
};
