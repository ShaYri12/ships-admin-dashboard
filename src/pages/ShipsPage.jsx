import React, { useState } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Ship, Anchor, Navigation, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data from JSON files
const MOCK_SHIPS = [
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
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
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
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [13.4, 13.8, 13.2, 13.6, 13.9, 13.5],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
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
          data: [13.4, 13.8, 13.2, 13.6, 13.9],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
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
      latitude: 48.857,
      longitude: 2.3528,
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Wind Speed (knots)",
          data: [12.1, 12.5, 12.0, 12.3, 12.6, 12.2],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Fan Speed",
          data: [2.9, 3.1, 2.8, 3.0, 3.2, 2.9],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
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
          data: [12.1, 12.5, 12.0, 12.3, 12.6],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
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
  },
];

const ShipsPage = () => {
  const [selectedShip, setSelectedShip] = useState(MOCK_SHIPS[0]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        max: 250,
      },
    },
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Ships Management</h1>
          <div className="relative">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 appearance-none w-full text-white"
              value={selectedShip.id}
              onChange={(e) =>
                setSelectedShip(
                  MOCK_SHIPS.find((s) => s.id === Number(e.target.value))
                )
              }
            >
              {MOCK_SHIPS.map((ship) => (
                <option key={ship.id} value={ship.id}>
                  {ship.name} (IMO: {ship.imo})
                </option>
              ))}
            </select>

            {/* Lucide Icon */}
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Ship Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6"
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex items-center mb-4">
              <Ship className="w-6 h-6 mr-3" style={{ color: "#6366f1" }} />
              <h3 className="text-lg font-semibold">Ship Details</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">
                IMO: <span className="text-white">{selectedShip.imo}</span>
              </p>
              <p className="text-gray-400">
                Type: <span className="text-white">{selectedShip.type}</span>
              </p>
              <p className="text-gray-400">
                Status:{" "}
                <span className="text-white">{selectedShip.status}</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6"
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex items-center mb-4">
              <Navigation
                className="w-6 h-6 mr-3"
                style={{ color: "#8B5CF6" }}
              />
              <h3 className="text-lg font-semibold">Navigation</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">
                Destination:{" "}
                <span className="text-white">{selectedShip.destination}</span>
              </p>
              <p className="text-gray-400">
                ETA: <span className="text-white">{selectedShip.eta}</span>
              </p>
              <p className="text-gray-400">
                Position:{" "}
                <span className="text-white">
                  {selectedShip.position.latitude.toFixed(4)},{" "}
                  {selectedShip.position.longitude.toFixed(4)}
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6"
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex items-center mb-4">
              <Anchor className="w-6 h-6 mr-3" style={{ color: "#EC4899" }} />
              <h3 className="text-lg font-semibold">Statistics</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">
                Wind Speed:{" "}
                <span className="text-white">
                  {selectedShip.statistics.wind_speed.avg} knots
                </span>
                <span className="text-xs text-gray-500 block">
                  Min: {selectedShip.statistics.wind_speed.min} | Max:{" "}
                  {selectedShip.statistics.wind_speed.max}
                </span>
              </p>
              <p className="text-gray-400">
                Fan Speed:{" "}
                <span className="text-white">
                  {selectedShip.statistics.fan_speed.avg}
                </span>
                <span className="text-xs text-gray-500 block">
                  Min: {selectedShip.statistics.fan_speed.min} | Max:{" "}
                  {selectedShip.statistics.fan_speed.max}
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Wing Rotation Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Wing Rotation Angle Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Wing Rotation Angle Distribution
            </h3>
            <div className="h-[300px]">
              <Bar data={selectedShip.wingRotationData} options={barOptions} />
            </div>
          </div>

          {/* Wind Speed Over Time */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Wind Speed Over Time</h3>
            <div className="h-[300px]">
              <Line data={selectedShip.windSpeedData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Metrics */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="h-[300px]">
              <Line
                data={selectedShip.performanceData}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Cargo Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Cargo Distribution</h3>
            <div className="h-[300px]">
              <Doughnut
                data={selectedShip.cargoData}
                options={doughnutOptions}
              />
            </div>
          </div>
        </div>

        {/* Maintenance Chart */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Maintenance Hours by Department
          </h3>
          <div className="h-[300px]">
            <Bar data={selectedShip.maintenanceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipsPage;
