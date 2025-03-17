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

        console.log(
          `Fetching ship statistics for IMO ${imo} from ${new Date(
            startTime * 1000
          ).toLocaleString()} to ${new Date(endTime * 1000).toLocaleString()}`
        );

        // Use the provided timestamps for the API request
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

      // If using mock data, return mock data from MOCK_SHIPS instead of trying to fetch from file
      try {
        // Import mock data directly from mockData.js
        const { MOCK_SHIPS } = await import("./mockData");
        const mockShip = MOCK_SHIPS.find((ship) => ship.imo === imo);

        if (!mockShip) {
          throw new Error(`Mock data not found for IMO: ${imo}`);
        }

        return {
          imo: mockShip.imo,
          name: mockShip.name,
          results_meta: {
            data_points_collected: mockShip.timeSeriesData?.length || 0,
          },
          results_aggregated: {
            aggregation_min: {
              wind_speed: mockShip.statistics?.wind_speed?.min || 0,
              fan_speed: mockShip.statistics?.fan_speed?.min || 0,
            },
            aggregation_max: {
              wind_speed: mockShip.statistics?.wind_speed?.max || 0,
              fan_speed: mockShip.statistics?.fan_speed?.max || 0,
            },
            aggregation_avg: {
              wind_speed: mockShip.statistics?.wind_speed?.avg || 0,
              fan_speed: mockShip.statistics?.fan_speed?.avg || 0,
            },
          },
          results_timed:
            mockShip.timeSeriesData?.map((point) => ({
              uuid: crypto.randomUUID(),
              timestamp: point.timestamp,
              sailData: [
                {
                  windAngle: point.windAngle || 0,
                  windSpeed: point.wind_speed || 0,
                  fanSpeed: point.fan_speed || 0,
                },
              ],
              shipData: {
                location: point.location || { latitude: 0, longitude: 0 },
                cog: point.cog || 0,
                sog: point.sog || 0,
                hdg: point.hdg || 0,
                rudderAngle: point.rudderAngle || 0,
              },
            })) || [],
        };
      } catch (mockError) {
        console.error("Failed to load mock data:", mockError);
        throw new Error("Failed to load mock data");
      }
    } catch (error) {
      console.error("Failed to fetch ship statistics:", error);
      // In live mode, propagate the error without any fallback
      if (!useMockData) {
        throw new Error(`Failed to fetch live data: ${error.message}`);
      }
      // In mock mode, propagate the mock data error
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
  transformShipData: (shipData) => {
    try {
      if (!shipData) {
        console.warn("Invalid ship data format received");
        return null;
      }

      const { imo, name, results_meta, results_aggregated, results_timed } =
        shipData;

      if (!imo || !name) {
        console.warn("Missing required ship data fields (IMO or name)");
        return null;
      }

      // Extract time series data
      const timeSeriesData = results_timed
        ? results_timed.map((point) => {
            const shipDataPoint = point.shipData || {};
            const sailDataPoint = point.sailData?.[0] || {};

            return {
              timestamp: point.timestamp,
              wind_speed: shipDataPoint.windSpeed || 0,
              fan_speed: sailDataPoint.fanSpeed || 0,
              windDirection: shipDataPoint.windDirection || 0,
              sog: shipDataPoint.sog || 0, // Speed Over Ground
              cog: shipDataPoint.cog || 0, // Course Over Ground
              hdg: shipDataPoint.hdg || 0, // Heading
              rudderAngle: shipDataPoint.rudderAngle || 0,
              latitude: shipDataPoint.location?.latitude,
              longitude: shipDataPoint.location?.longitude,
            };
          })
        : [];

      // Generate path from time series data locations
      const path = timeSeriesData
        .filter((point) => point.latitude && point.longitude)
        .map((point) => [point.latitude, point.longitude]);

      // Get the latest position from time series data or use a default
      let shipPosition = { latitude: 52.3708, longitude: 4.8958 }; // Default to Amsterdam

      if (timeSeriesData.length > 0) {
        // Find the latest point with valid coordinates
        const validPoints = timeSeriesData.filter(
          (point) => point.latitude && point.longitude
        );

        if (validPoints.length > 0) {
          const latestPoint = validPoints[validPoints.length - 1];
          shipPosition = {
            latitude: latestPoint.latitude,
            longitude: latestPoint.longitude,
          };
        }
      }

      // Determine ship type based on IMO or name if not provided by API
      let shipType = shipData.type || "Unknown";
      if (!shipType || shipType === "Unknown") {
        // Try to infer ship type from name or IMO
        if (name.toLowerCase().includes("tanker")) {
          shipType = "Tanker";
        } else if (name.toLowerCase().includes("container")) {
          shipType = "Container Ship";
        } else if (name.toLowerCase().includes("bulk")) {
          shipType = "Bulk Carrier";
        } else if (imo === "9996903") {
          shipType = "Container Ship";
        } else if (imo === "9512331") {
          shipType = "Bulk Carrier";
        } else if (imo === "999690") {
          shipType = "Tanker";
        } else {
          shipType = "Cargo Ship";
        }
      }

      // Determine ship status based on API data or default to "En Route"
      const shipStatus = shipData.status || "En Route";

      // Determine destination and ETA from API data or use defaults
      const destination = shipData.destination || "Rotterdam, Netherlands";
      const eta =
        shipData.eta ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      // Generate a color based on the ship's IMO
      const generateColor = (imo) => {
        const colors = [
          "#6366f1", // Indigo
          "#8B5CF6", // Purple
          "#EC4899", // Pink
          "#10B981", // Green
          "#F59E0B", // Amber
          "#EF4444", // Red
        ];

        // Use the last digit of the IMO to select a color
        const lastDigit = parseInt(imo.slice(-1), 10);
        return colors[lastDigit % colors.length];
      };

      return {
        id: imo,
        name,
        imo,
        statistics: {
          wind_speed: {
            avg: results_aggregated.aggregation_avg.wind_speed || 0,
            max: results_aggregated.aggregation_max.wind_speed || 0,
            min: results_aggregated.aggregation_min.wind_speed || 0,
          },
          fan_speed: {
            avg: results_aggregated.aggregation_avg.fan_speed || 0,
            max: results_aggregated.aggregation_max.fan_speed || 0,
            min: results_aggregated.aggregation_min.fan_speed || 0,
          },
        },
        timeSeriesData,
        path: path,
        position: shipPosition,
        type: shipType,
        status: shipStatus,
        destination: destination,
        eta: eta,
        color: generateColor(imo),
        performanceData: {
          labels: timeSeriesData.map((point) =>
            new Date(point.timestamp * 1000).toLocaleTimeString()
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
        // Generate other chart data based on actual time series data
        windSpeedData: {
          labels: timeSeriesData.map((point) =>
            new Date(point.timestamp * 1000).toLocaleTimeString()
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
            new Date(point.timestamp * 1000).toLocaleTimeString()
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
        // Add default cargo data
        cargoData: {
          labels: ["General Cargo", "Containers", "Bulk Materials", "Liquids"],
          datasets: [
            {
              data: [
                Math.floor(Math.random() * 40) + 20,
                Math.floor(Math.random() * 30) + 10,
                Math.floor(Math.random() * 20) + 5,
                Math.floor(Math.random() * 15) + 5,
              ],
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(139, 92, 246, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(16, 185, 129, 0.8)",
              ],
              borderColor: [
                "rgba(99, 102, 241, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(236, 72, 153, 1)",
                "rgba(16, 185, 129, 1)",
              ],
            },
          ],
        },
        // Add default maintenance data
        maintenanceData: {
          labels: ["Engine", "Hull", "Navigation", "Electrical", "Safety"],
          datasets: [
            {
              label: "Maintenance Hours",
              data: [
                Math.floor(Math.random() * 50) + 20,
                Math.floor(Math.random() * 40) + 10,
                Math.floor(Math.random() * 30) + 10,
                Math.floor(Math.random() * 25) + 15,
                Math.floor(Math.random() * 20) + 10,
              ],
              backgroundColor: "rgba(99, 102, 241, 0.8)",
              borderColor: "rgba(99, 102, 241, 1)",
              borderWidth: 1,
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
