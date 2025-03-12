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
            start_time: startTime,
            end_time: endTime,
          },
        });

        if (!response.data) {
          throw new Error("No data received from API");
        }

        return response.data;
      }

      // If using mock data, return mock data based on the new API format
      const shipName =
        imo === "9996903"
          ? "Amadeus Saffier"
          : imo === "9996904"
          ? "Paulo Tanker"
          : "Unknown Ship";

      return {
        imo,
        name: shipName,
        results_meta: {
          data_points_collected: 8,
        },
        results_aggregated: {
          aggregation_min: {
            wind_speed: 20,
            fan_speed: 0,
          },
          aggregation_max: {
            wind_speed: 67,
            fan_speed: 0,
          },
          aggregation_avg: {
            wind_speed: 71.25,
            fan_speed: 0,
          },
        },
        results_timed: [
          {
            uuid: "e3c34f74-571f-48ff-a2ca-26765b164bd0",
            timestamp: Math.floor((Date.now() - 8 * 60 * 60 * 1000) / 1000),
            sailData: [
              {
                windAngle: 125,
                windSpeed: 20,
                windRotationAngle: null,
                wingUp: false,
                wingDown: null,
                fanSpeed: 0,
                autoModeOn: null,
                forwardForce: null,
                sidewayForce: null,
                hpRunning: false,
                alarmPresent: false,
                autoSailingActive: false,
                reserve: 0,
              },
              {
                windAngle: 133,
                windSpeed: 59,
                windRotationAngle: null,
                wingUp: false,
                wingDown: null,
                fanSpeed: 0,
                autoModeOn: null,
                forwardForce: null,
                sidewayForce: null,
                hpRunning: false,
                alarmPresent: false,
                autoSailingActive: false,
                reserve: 0,
              },
            ],
            shipData: {},
          },
          {
            uuid: "18a81973-6019-4961-b692-f30f10a4a130",
            timestamp: Math.floor((Date.now() - 7 * 60 * 60 * 1000) / 1000),
            sailData: [
              {
                windAngle: 125,
                windSpeed: 36,
                windRotationAngle: null,
                wingUp: false,
                wingDown: null,
                fanSpeed: 0,
                autoModeOn: null,
                forwardForce: null,
                sidewayForce: null,
                hpRunning: false,
                alarmPresent: false,
                autoSailingActive: false,
                reserve: 0,
              },
              {
                windAngle: 133,
                windSpeed: 58,
                windRotationAngle: null,
                wingUp: false,
                wingDown: null,
                fanSpeed: 0,
                autoModeOn: null,
                forwardForce: null,
                sidewayForce: null,
                hpRunning: false,
                alarmPresent: false,
                autoSailingActive: false,
                reserve: 0,
              },
            ],
            shipData: {},
          },
        ],
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
        results_aggregated = {},
        results_timed = [],
      } = apiData;

      // Validate required fields
      if (!imo || !name) {
        throw new Error("Missing required fields in API data");
      }

      // Extract aggregated statistics
      const statistics_min = results_aggregated.aggregation_min || {};
      const statistics_max = results_aggregated.aggregation_max || {};
      const statistics_avg = results_aggregated.aggregation_avg || {};

      // Generate path points from time series data with validation
      // Since we don't have location data in the new API format, we'll use default values
      const defaultPath = [
        [52.3702, 4.8952],
        [52.422, 4.58],
        [52.4632, 4.5552],
        [52.5, 4.2],
        [52.45, 3.9],
        [52.2, 3.7],
        [51.99, 3.8],
        [51.9581, 4.0494],
        [51.9225, 4.4792],
      ];

      // Transform time series data
      const timeSeriesData = results_timed.map((point) => {
        // Get the first sail data if available
        const sailData =
          point.sailData && point.sailData.length > 0
            ? point.sailData[0]
            : { windSpeed: 0, windAngle: 0, fanSpeed: 0 };

        return {
          timestamp: point.timestamp * 1000, // Convert to milliseconds
          wind_speed: sailData.windSpeed || 0,
          fan_speed: sailData.fanSpeed || 0,
          windAngle: sailData.windAngle || 0,
          location: { latitude: 52.371, longitude: 4.7 }, // Amsterdam (near shore)
          rudderAngle: 0,
          sog: 0,
          cog: 0,
          hdg: 0,
          windDirection: sailData.windAngle || 0,
        };
      });

      return {
        id: imo,
        name,
        imo,
        statistics: {
          wind_speed: {
            avg: statistics_avg.wind_speed || 0,
            max: statistics_max.wind_speed || 0,
            min: statistics_min.wind_speed || 0,
          },
          fan_speed: {
            avg: statistics_avg.fan_speed || 0,
            max: statistics_max.fan_speed || 0,
            min: statistics_min.fan_speed || 0,
          },
        },
        timeSeriesData,
        path: defaultPath,
        position: { latitude: 52.371, longitude: 4.895 }, // Amsterdam (near shore)
        type: "Container Ship", // Default type
        status: "En Route", // Default status
        destination: "Rotterdam", // Default destination
        eta: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // Tomorrow
        color: "#6366f1", // Default color
        performanceData: {
          labels: timeSeriesData.map((point) =>
            new Date(point.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Wind Speed (knots)",
              data: timeSeriesData.map((point) => point.wind_speed),
              borderColor: "#6366f1",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.4,
            },
            {
              label: "Fan Speed",
              data: timeSeriesData.map((point) => point.fan_speed),
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              tension: 0.4,
            },
          ],
        },
        cargoData: {
          labels: ["Container", "Bulk", "Vehicle", "Other"],
          datasets: [
            {
              data: [450, 150, 200, 100],
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(139, 92, 246, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(16, 185, 129, 0.8)",
              ],
            },
          ],
        },
        maintenanceData: {
          labels: [
            "Engine",
            "Hull",
            "Electronics",
            "Safety",
            "Navigation",
            "Other",
          ],
          datasets: [
            {
              label: "Maintenance Hours",
              data: [24, 12, 8, 16, 10, 6],
              backgroundColor: "rgba(99, 102, 241, 0.8)",
            },
          ],
        },
        windSpeedData: {
          labels: timeSeriesData.map((point) =>
            new Date(point.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Wind Speed",
              data: timeSeriesData.map((point) => point.wind_speed),
              borderColor: "#6366f1",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.4,
            },
          ],
        },
        wingRotationData: {
          labels: timeSeriesData.map((point) =>
            new Date(point.timestamp).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Wind Angle",
              data: timeSeriesData.map((point) => point.windAngle || 0),
              borderColor: "#6366f1",
              backgroundColor: "rgb(99, 102, 241)",
              barThickness: 8,
            },
          ],
        },
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
          timestamp: Math.floor(Date.now() / 1000), // Convert to seconds for API
          sailData: [
            {
              sailId: "1",
              windSpeed,
              fanSpeed,
              windRotationAngle: wingRotationAngle,
              windAngle: windDirection || course,
              wingUp: false,
              wingDown: false,
              autoModeOn: false,
              forwardForce: null,
              sidewayForce: null,
              hpRunning: false,
              alarmPresent: false,
              autoSailingActive: false,
              reserve: 0,
            },
          ],
          shipData: {
            location: {
              latitude: position.latitude,
              longitude: position.longitude,
            },
            cog: course,
            sog: speed,
            rudderAngle,
          },
        },
      ],
    };
  },

  // Start real-time updates
  startRealtimeUpdates: (imo, callback, interval = 30000) => {
    const updateInterval = setInterval(async () => {
      try {
        const endTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const startTime = endTime - 5 * 60; // Last 5 minutes in seconds
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
