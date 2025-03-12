// Mock ships data based on the new API format
export const MOCK_SHIPS = [
  {
    id: 1,
    name: "Amadeus Saffier",
    imo: "9996903",
    type: "Container Ship",
    status: "En Route",
    destination: "Rotterdam",
    eta: "2024-07-15",
    position: {
      latitude: 52.3708,
      longitude: 4.8958,
    },
    path: [
      [52.3702, 4.8952],
      [52.422, 4.58],
      [52.4632, 4.5552],
      [52.5, 4.2],
      [52.45, 3.9],
      [52.2, 3.7],
      [51.99, 3.8],
      [51.9581, 4.0494],
      [51.9225, 4.4792],
    ],
    timeSeriesData: [
      {
        timestamp: Math.floor((Date.now() - 8 * 60 * 60 * 1000) / 1000),
        wind_speed: 20,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.3702, longitude: 4.8952 },
        rudderAngle: 0,
        sog: 12.5,
        cog: 270,
        hdg: 268,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 7 * 60 * 60 * 1000) / 1000),
        wind_speed: 36,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.422, longitude: 4.58 },
        rudderAngle: 0,
        sog: 13.1,
        cog: 265,
        hdg: 267,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 6 * 60 * 60 * 1000) / 1000),
        wind_speed: 23,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.4632, longitude: 4.5552 },
        rudderAngle: 0,
        sog: 12.8,
        cog: 260,
        hdg: 262,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 5 * 60 * 60 * 1000) / 1000),
        wind_speed: 67,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.5, longitude: 4.2 },
        rudderAngle: 0,
        sog: 12.9,
        cog: 258,
        hdg: 260,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 4 * 60 * 60 * 1000) / 1000),
        wind_speed: 26,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.45, longitude: 3.9 },
        rudderAngle: 0,
        sog: 13.2,
        cog: 255,
        hdg: 257,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 3 * 60 * 60 * 1000) / 1000),
        wind_speed: 26,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 52.2, longitude: 3.7 },
        rudderAngle: 0,
        sog: 12.7,
        cog: 250,
        hdg: 252,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 2 * 60 * 60 * 1000) / 1000),
        wind_speed: 25,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 51.99, longitude: 3.8 },
        rudderAngle: 0,
        sog: 12.6,
        cog: 245,
        hdg: 247,
        windDirection: 125,
      },
      {
        timestamp: Math.floor((Date.now() - 1 * 60 * 60 * 1000) / 1000),
        wind_speed: 25,
        fan_speed: 0,
        windAngle: 125,
        location: { latitude: 51.9581, longitude: 4.0494 },
        rudderAngle: 0,
        sog: 12.4,
        cog: 240,
        hdg: 242,
        windDirection: 125,
      },
    ],
    color: "#6366f1",
    statistics: {
      wind_speed: {
        avg: 71.25,
        max: 67,
        min: 20,
      },
      fan_speed: {
        avg: 0,
        max: 0,
        min: 0,
      },
    },
    performanceData: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [20, 36, 23, 67, 26, 26, 25, 25],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
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
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Speed",
          data: [20, 36, 23, 67, 26, 26, 25, 25],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
      ],
    },
    wingRotationData: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Angle",
          data: [125, 125, 125, 125, 125, 125, 125, 125],
          borderColor: "#6366f1",
          backgroundColor: "rgb(99, 102, 241)",
          barThickness: 8,
        },
      ],
    },
  },
  {
    id: 2,
    name: "Paulo Tanker",
    imo: "9996904",
    type: "Oil Tanker",
    status: "En Route",
    destination: "San Francisco",
    eta: "2024-07-20",
    position: {
      latitude: 34.0528,
      longitude: -118.2442,
    },
    path: [
      [34.0528, -118.2442],
      [33.7157, -118.652],
      [33.8, -119.5],
      [34.2, -120.7],
      [35.5, -121.8],
      [36.8, -122.5],
      [37.5, -122.8],
      [37.7749, -122.4194],
    ],
    timeSeriesData: [
      {
        timestamp: Math.floor((Date.now() - 8 * 60 * 60 * 1000) / 1000),
        wind_speed: 18,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 34.0528, longitude: -118.2442 },
        rudderAngle: 0,
        sog: 11.5,
        cog: 270,
        hdg: 268,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 7 * 60 * 60 * 1000) / 1000),
        wind_speed: 22,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 33.7157, longitude: -118.652 },
        rudderAngle: 0,
        sog: 12.1,
        cog: 265,
        hdg: 267,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 6 * 60 * 60 * 1000) / 1000),
        wind_speed: 25,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 33.8, longitude: -119.5 },
        rudderAngle: 0,
        sog: 11.8,
        cog: 260,
        hdg: 262,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 5 * 60 * 60 * 1000) / 1000),
        wind_speed: 30,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 34.2, longitude: -120.7 },
        rudderAngle: 0,
        sog: 11.9,
        cog: 258,
        hdg: 260,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 4 * 60 * 60 * 1000) / 1000),
        wind_speed: 28,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 35.5, longitude: -121.8 },
        rudderAngle: 0,
        sog: 12.2,
        cog: 255,
        hdg: 257,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 3 * 60 * 60 * 1000) / 1000),
        wind_speed: 26,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 36.8, longitude: -122.5 },
        rudderAngle: 0,
        sog: 11.7,
        cog: 250,
        hdg: 252,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 2 * 60 * 60 * 1000) / 1000),
        wind_speed: 24,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 37.5, longitude: -122.8 },
        rudderAngle: 0,
        sog: 11.6,
        cog: 245,
        hdg: 247,
        windDirection: 130,
      },
      {
        timestamp: Math.floor((Date.now() - 1 * 60 * 60 * 1000) / 1000),
        wind_speed: 22,
        fan_speed: 0,
        windAngle: 130,
        location: { latitude: 37.7749, longitude: -122.4194 },
        rudderAngle: 0,
        sog: 11.4,
        cog: 240,
        hdg: 242,
        windDirection: 130,
      },
    ],
    color: "#8B5CF6",
    statistics: {
      wind_speed: {
        avg: 24.38,
        max: 30,
        min: 18,
      },
      fan_speed: {
        avg: 0,
        max: 0,
        min: 0,
      },
    },
    performanceData: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [18, 22, 25, 30, 28, 26, 24, 22],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cargoData: {
      labels: ["Oil", "Gas", "Chemicals", "Other"],
      datasets: [
        {
          data: [650, 250, 100, 50],
          backgroundColor: [
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(99, 102, 241, 0.8)",
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
          data: [30, 15, 10, 20, 12, 8],
          backgroundColor: "rgba(139, 92, 246, 0.8)",
        },
      ],
    },
    windSpeedData: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Speed",
          data: [18, 22, 25, 30, 28, 26, 24, 22],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    wingRotationData: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Wind Angle",
          data: [130, 130, 130, 130, 130, 130, 130, 130],
          borderColor: "#8B5CF6",
          backgroundColor: "rgb(139, 92, 246)",
          barThickness: 8,
        },
      ],
    },
  },
];

// Dashboard statistics
export const MOCK_DASHBOARD_STATS = {
  activeShips: MOCK_SHIPS.length.toString(),
  totalCargo: "45,678 tons",
  fuelConsumption: "1,234 tons",
  avgSpeed: `${(
    MOCK_SHIPS.reduce((acc, ship) => acc + ship.statistics.wind_speed.avg, 0) /
    MOCK_SHIPS.length
  ).toFixed(1)} knots`,
};

// Chart data
export const MOCK_CHART_DATA = {
  shipTypes: {
    labels: ["Cargo Ships", "Tankers", "Container Ships", "Bulk Carriers"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    ],
  },
  monthlyCargoVolume: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Cargo Volume (tons)",
        data: [45000, 52000, 49000, 47000, 53000, 51000],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  },
  fuelEfficiency: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Fuel Efficiency (nm/ton)",
        data: [12.5, 12.8, 12.3, 12.9, 12.6, 12.7],
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
};
