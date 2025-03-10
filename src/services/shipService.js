import { api, handleApiError } from "./api";
import { MOCK_SHIPS, MOCK_DASHBOARD_STATS, MOCK_CHART_DATA } from "./mockData";

// Flag to control whether to use mock data
const USE_MOCK_DATA = true; // Set this to false when ready to use real API

// Ship-related API calls
export const shipService = {
  // Get all ships
  getAllShips: async () => {
    if (USE_MOCK_DATA) {
      return MOCK_SHIPS;
    }

    try {
      const response = await api.get("/ships");
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch ships from API, falling back to mock data");
      return MOCK_SHIPS;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      return MOCK_DASHBOARD_STATS;
    }

    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.warn(
        "Failed to fetch dashboard stats from API, falling back to mock data"
      );
      return MOCK_DASHBOARD_STATS;
    }
  },

  // Get chart data
  getChartData: async () => {
    if (USE_MOCK_DATA) {
      return MOCK_CHART_DATA;
    }

    try {
      const response = await api.get("/dashboard/charts");
      return response.data;
    } catch (error) {
      console.warn(
        "Failed to fetch chart data from API, falling back to mock data"
      );
      return MOCK_CHART_DATA;
    }
  },

  // Get single ship by ID
  getShipById: async (id) => {
    if (USE_MOCK_DATA) {
      return MOCK_SHIPS.find((ship) => ship.id === id);
    }

    try {
      const response = await api.get(`/ships/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch ship from API, falling back to mock data");
      return MOCK_SHIPS.find((ship) => ship.id === id);
    }
  },

  // Update ship
  updateShip: async (id, data) => {
    if (USE_MOCK_DATA) {
      return { ...MOCK_SHIPS.find((ship) => ship.id === id), ...data };
    }

    try {
      const response = await api.put(`/ships/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
