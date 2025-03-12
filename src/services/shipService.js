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

      // In the real implementation, we would fetch all ships
      // For now, we'll use a hardcoded IMO number since the API doesn't support fetching all ships
      const imo = "9996903"; // Amadeus Saffier
      const response = await shipDataService.getShipStatistics(
        imo,
        Math.floor(Date.now() / 1000) - 24 * 60 * 60, // last 24 hours in seconds
        Math.floor(Date.now() / 1000) // current time in seconds
      );

      if (!response) {
        throw new Error("Invalid response format from API");
      }

      // Transform the single ship data and return as an array
      return [shipDataService.transformShipData(response)];
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

      return await shipDataService.submitShipData(shipData);
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

      // Convert dates to timestamps if they're not already
      const startTimestamp =
        typeof startTime === "number"
          ? startTime
          : Math.floor(new Date(startTime).getTime() / 1000);

      const endTimestamp =
        typeof endTime === "number"
          ? endTime
          : Math.floor(new Date(endTime).getTime() / 1000);

      const response = await shipDataService.getShipStatistics(
        imo,
        startTimestamp,
        endTimestamp
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
