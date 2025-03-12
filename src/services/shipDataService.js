import { api } from "./api";
import { locationService } from "./locationService";

// Development flag - set to true to use mock data
const DEV_MODE = process.env.NODE_ENV === "development";

export const shipDataService = {
  // Get ship statistics for a specific time range
  getShipStatistics: async (
    imo,
    startTime,
    endTime,
    useMockData = DEV_MODE
  ) => {
    try {
      if (!useMockData) {
        // Verify Netherlands VPN connection
        await locationService.getNetherlands();

        const response = await api.get(`/data/ships/${imo}/statistics`, {
          params: {
            start_time: new Date(startTime).getTime(),
            end_time: new Date(endTime).getTime(),
          },
        });

        if (!response.data) {
          throw new Error("No data received from API");
        }

        return response.data;
      }

      // If using mock data, return mock data
      return {
        imo,
        name: "Mock Ship",
        statistics_average: { wind_speed: 15, fan_speed: 3 },
        statistics_max: { wind_speed: 20, fan_speed: 4 },
        statistics_min: { wind_speed: 10, fan_speed: 2 },
        statistics_per_time: [],
      };
    } catch (error) {
      console.error("Failed to fetch ship statistics:", error);
      if (!useMockData) {
        throw new Error(
          "Failed to fetch live data. Please ensure you are connected to a Netherlands VPN and try again."
        );
      }
      throw error;
    }
  },

  // Submit ship data
  submitShipData: async (shipData, useMockData = DEV_MODE) => {
    try {
      if (!useMockData) {
        // Verify Netherlands VPN connection
        await locationService.getNetherlands();
      }

      // If in mock mode, return a successful response
      if (useMockData) {
        console.log("Using mock mode for ship submission");
        return {
          success: true,
          message: "Ship data submitted successfully (mock)",
          data: shipData,
        };
      }

      const processedData = shipDataService.processShipRecord(shipData);

      // For debugging
      console.log("Submitting ship data to API");
      console.log("Processed data:", processedData);

      const response = await api.post(`/data/ships`, processedData);

      return response.data;
    } catch (error) {
      console.error("Failed to submit ship data:", error);

      // For debugging - log more details about the error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }

      throw error;
    }
  },

  // Transform API data to application format with better error handling
  transformShipData: (apiData) => {
    try {
      if (!apiData || typeof apiData !== "object") {
        throw new Error("Invalid API data received");
      }

      const {
        imo,
        name,
        statistics_average = {},
        statistics_max = {},
        statistics_min = {},
        statistics_per_time = [],
      } = apiData;

      // Validate required fields
      if (!imo || !name) {
        throw new Error("Missing required fields in API data");
      }

      // Generate path points from time series data with validation
      const path = statistics_per_time
        .filter(
          (point) =>
            point?.shipData?.location?.latitude &&
            point?.shipData?.location?.longitude
        )
        .map((point) => [
          point.shipData.location.latitude,
          point.shipData.location.longitude,
        ]);

      return {
        id: imo,
        name,
        imo,
        statistics: {
          wind_speed: {
            avg: statistics_average.wind_speed || 0,
            max: statistics_max.wind_speed || 0,
            min: statistics_min.wind_speed || 0,
          },
          fan_speed: {
            avg: statistics_average.fan_speed || 0,
            max: statistics_max.fan_speed || 0,
            min: statistics_min.fan_speed || 0,
          },
        },
        timeSeriesData: statistics_per_time.map((point) => ({
          timestamp: new Date(point.timestamp || Date.now()).getTime(),
          wind_speed: point.wind_speed || 0,
          fan_speed: point.fan_speed || 0,
          location: point.shipData?.location || { latitude: 0, longitude: 0 },
          rudderAngle: point.shipData?.rudderAngle || 0,
          sog: point.shipData?.sog || 0,
          cog: point.shipData?.cog || 0,
          hdg: point.shipData?.hdg || 0,
          windDirection: point.shipData?.windDirection || 0,
        })),
        path,
        position: path[path.length - 1]
          ? {
              latitude: path[path.length - 1][0],
              longitude: path[path.length - 1][1],
            }
          : { latitude: 0, longitude: 0 },
      };
    } catch (error) {
      console.error("Error transforming ship data:", error);
      throw new Error("Failed to process ship data: " + error.message);
    }
  },

  // Process ship record for submission
  processShipRecord: (shipData) => {
    const {
      imo,
      name,
      position,
      windSpeed,
      fanSpeed,
      wingRotationAngle,
      course,
      speed,
      rudderAngle,
      windDirection,
    } = shipData;

    return {
      imo,
      name,
      data: [
        {
          uuid: crypto.randomUUID(),
          timestamp: Date.now(),
          sailData: [
            {
              sailId: "1",
              windSpeed,
              fanSpeed,
              wingRotationAngle,
              windAngle: course,
              autoModeOn: true,
            },
          ],
          shipData: {
            location: {
              latitude: position.latitude,
              longitude: position.longitude,
            },
            windSpeed,
            windDirection,
            sog: speed,
            rudderAngle,
            cog: course,
          },
        },
      ],
    };
  },

  // Start real-time updates
  startRealtimeUpdates: (imo, callback, interval = 30000) => {
    const updateInterval = setInterval(async () => {
      try {
        const endTime = new Date();
        const startTime = new Date(endTime - 5 * 60 * 1000); // Last 5 minutes
        const data = await shipDataService.getShipStatistics(
          imo,
          startTime,
          endTime
        );
        callback(shipDataService.transformShipData(data));
      } catch (error) {
        console.error("Failed to fetch real-time updates:", error);
      }
    }, interval);

    return () => clearInterval(updateInterval);
  },
};
