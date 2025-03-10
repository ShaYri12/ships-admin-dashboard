// Mock ships data
export const MOCK_SHIPS = [
  {
    id: 1,
    name: "Vlad Container",
    imo: "5550011",
    type: "Container Ship",
    status: "En Route",
    destination: "Rotterdam",
    eta: "2024-03-10",
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
    color: "#6366f1",
    statistics: {
      wind_speed: {
        avg: 15.7,
        max: 19.3,
        min: 12.2,
      },
      fan_speed: {
        avg: 3.9,
        max: 4.4,
        min: 3.1,
      },
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [15.7, 16.2, 15.9, 15.5, 16.0, 15.8],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [3.9, 4.0, 3.8, 3.7, 4.1, 3.9],
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
    wingRotationData: {
      labels: Array.from({ length: 24 }, (_, i) => i * 10),
      datasets: [
        {
          label: "Wing Rotation Angle",
          data: Array.from({ length: 24 }, () =>
            Math.floor(Math.random() * 200)
          ),
          borderColor: "#6366f1",
          backgroundColor: "rgb(99, 102, 241)",
          barThickness: 8,
        },
      ],
    },
    windSpeedData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "Wind Speed",
          data: [15.7, 16.2, 15.9, 15.5, 16.0],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
      ],
    },
  },
  {
    id: 2,
    name: "Paulo Tanker",
    imo: "5550022",
    type: "Oil Tanker",
    status: "En Route",
    destination: "San Francisco",
    eta: "2024-03-15",
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
    color: "#8B5CF6",
    statistics: {
      wind_speed: {
        avg: 13.4,
        max: 16.0,
        min: 11.0,
      },
      fan_speed: {
        avg: 3.3,
        max: 4.0,
        min: 2.7,
      },
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [13.4, 13.8, 13.2, 13.6, 13.9, 13.5],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [3.3, 3.5, 3.2, 3.4, 3.6, 3.3],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cargoData: {
      labels: ["Crude Oil", "Refined Oil", "Chemicals", "Empty"],
      datasets: [
        {
          data: [400, 300, 200, 100],
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
          data: [30, 15, 10, 20, 12, 8],
          backgroundColor: "rgba(139, 92, 246, 0.8)",
        },
      ],
    },
    wingRotationData: {
      labels: Array.from({ length: 24 }, (_, i) => i * 10),
      datasets: [
        {
          label: "Wing Rotation Angle",
          data: Array.from({ length: 24 }, () =>
            Math.floor(Math.random() * 180)
          ),
          borderColor: "#8B5CF6",
          backgroundColor: "rgb(139, 92, 246)",
          barThickness: 8,
        },
      ],
    },
    windSpeedData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "Wind Speed",
          data: [13.4, 13.8, 13.2, 13.6, 13.9],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
  },
  {
    id: 3,
    name: "Evy Yacht",
    imo: "5550033",
    type: "Yacht",
    status: "En Route",
    destination: "Mediterranean",
    eta: "2024-03-20",
    position: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    path: [
      [48.8566, 2.3522],
      [49.4897, 0.1089],
      [49.85, -1.6],
      [49.6, -3],
      [48.8, -5.0],
      [47.5, -5.0],
      [45.8, -3.5],
      [44.5, -3.0],
      [43.8, -2.0],
      [43.36, -2.0],
      [43.2, -1.8],
    ],
    color: "#EC4899",
    statistics: {
      wind_speed: {
        avg: 12.1,
        max: 14.0,
        min: 10.0,
      },
      fan_speed: {
        avg: 2.9,
        max: 3.5,
        min: 2.5,
      },
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [12.1, 12.5, 12.0, 12.3, 12.6, 12.2],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [2.9, 3.1, 2.8, 3.0, 3.2, 2.9],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cargoData: {
      labels: ["Passengers", "Supplies", "Equipment", "Other"],
      datasets: [
        {
          data: [150, 100, 50, 50],
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
          data: [20, 10, 8, 15, 10, 5],
          backgroundColor: "rgba(236, 72, 153, 0.8)",
        },
      ],
    },
    wingRotationData: {
      labels: Array.from({ length: 24 }, (_, i) => i * 10),
      datasets: [
        {
          label: "Wing Rotation Angle",
          data: Array.from({ length: 24 }, () =>
            Math.floor(Math.random() * 160)
          ),
          borderColor: "#EC4899",
          backgroundColor: "rgb(236, 72, 153)",
          barThickness: 8,
        },
      ],
    },
    windSpeedData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "Wind Speed",
          data: [12.1, 12.5, 12.0, 12.3, 12.6],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
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
