import { shipDataService } from "./shipDataService";
import { MOCK_SHIPS } from "./mockData";

// Development flag - set to true to use mock data
const DEV_MODE = process.env.NODE_ENV === "development";

export const shipService = {
  getAllShips: async (useMockData = true) => {
    try {
      if (useMockData) {
        console.log("Using mock ship data");
        return MOCK_SHIPS;
      }

      const response = await shipDataService.getShipStatistics(
        "all",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // last 24 hours
        new Date().toISOString()
      );

      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format from API");
      }

      return response.map(shipDataService.transformShipData);
    } catch (error) {
      console.error("Failed to fetch ships:", error);
      // Don't fall back to mock data, instead throw the error
      throw error;
    }
  },

  updateShipData: async (shipData, useMockData = DEV_MODE) => {
    try {
      if (useMockData) {
        console.log("Using mock data for update");
        return { success: true, data: shipData };
      }

      const processedData = shipDataService.processShipRecord(shipData);
      return await shipDataService.submitShipData(processedData);
    } catch (error) {
      console.error("Failed to update ship data:", error);
      throw error;
    }
  },

  getShipStatistics: async (
    imo,
    startTime,
    endTime,
    useMockData = DEV_MODE
  ) => {
    try {
      if (useMockData) {
        console.log("Using mock statistics data");
        const mockShip = MOCK_SHIPS.find((ship) => ship.imo === imo);
        return mockShip || null;
      }

      const response = await shipDataService.getShipStatistics(
        imo,
        startTime,
        endTime
      );
      return shipDataService.transformShipData(response);
    } catch (error) {
      console.error("Failed to fetch ship statistics:", error);
      // Fallback to mock data if API call fails
      const mockShip = MOCK_SHIPS.find((ship) => ship.imo === imo);
      return mockShip || null;
    }
  },
};
