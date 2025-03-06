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

// Mock data - will be replaced with API data later
const MOCK_SHIPS = [
  {
    id: 1,
    name: "Cargo Ship Alpha",
    type: "Cargo",
    status: "En Route",
    speed: 15,
    destination: "Rotterdam",
    eta: "2024-03-10",
    position: {
      latitude: 51.505,
      longitude: -0.09,
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Fuel Consumption (tons)",
          data: [65, 59, 80, 81, 56, 55],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Speed (knots)",
          data: [28, 48, 40, 19, 86, 27],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cargoData: {
      labels: ["Container", "Bulk", "Liquid", "Vehicle", "Other"],
      datasets: [
        {
          data: [300, 150, 100, 200, 50],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
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
          data: [
            0, 5, 200, 8, 10, 15, 20, 55, 12, 8, 5, 3, 2, 150, 8, 5, 3, 2, 1, 0,
            2, 3, 5, 8,
          ],
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
          data: [0, 0, 12, 2, 0],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "COG",
          data: [0, 0, 300, 250, 240],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
      ],
    },
    sogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "SOG",
          data: [0, 0, 10, 2, 8],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
      ],
    },
    wingUpDownData: {
      labels: ["Up", "Down"],
      datasets: [
        {
          data: [85, 15],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: "Tanker Beta",
    type: "Oil Tanker",
    status: "Docked",
    speed: 0,
    destination: "Hamburg",
    eta: "2024-03-15",
    position: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Fuel Consumption (tons)",
          data: [45, 52, 48, 58, 50, 48],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Speed (knots)",
          data: [22, 25, 23, 20, 24, 21],
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
          data: [450, 200, 150, 100],
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
          data: [
            10, 15, 180, 12, 15, 20, 25, 45, 15, 10, 8, 5, 3, 140, 10, 8, 5, 3,
            2, 1, 3, 5, 8, 10,
          ],
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
          data: [0, 0, 14, 3, 0],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "COG",
          data: [0, 0, 280, 230, 220],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
      ],
    },
    sogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "SOG",
          data: [0, 0, 12, 3, 9],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
      ],
    },
    wingUpDownData: {
      labels: ["Up", "Down"],
      datasets: [
        {
          data: [80, 20],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: "Container Gamma",
    type: "Container Ship",
    status: "En Route",
    speed: 18,
    destination: "Singapore",
    eta: "2024-03-20",
    position: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    performanceData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Fuel Consumption (tons)",
          data: [75, 70, 72, 68, 73, 71],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
        },
        {
          label: "Speed (knots)",
          data: [30, 32, 31, 29, 33, 30],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cargoData: {
      labels: ["Electronics", "Textiles", "Machinery", "Food", "Other"],
      datasets: [
        {
          data: [400, 300, 250, 200, 150],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
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
          data: [28, 14, 12, 18, 15, 10],
          backgroundColor: "rgba(236, 72, 153, 0.8)",
        },
      ],
    },
    wingRotationData: {
      labels: Array.from({ length: 24 }, (_, i) => i * 10),
      datasets: [
        {
          label: "Wing Rotation Angle",
          data: [
            5, 10, 160, 15, 20, 25, 30, 50, 20, 15, 10, 8, 5, 130, 15, 10, 8, 5,
            3, 2, 5, 8, 10, 12,
          ],
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
          data: [0, 0, 16, 4, 0],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
      ],
    },
    cogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "COG",
          data: [0, 0, 320, 270, 260],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          tension: 0.4,
        },
      ],
    },
    sogData: {
      labels: [
        "2024-10-01",
        "2024-11-01",
        "2024-12-01",
        "2025-01-01",
        "2025-02-01",
      ],
      datasets: [
        {
          label: "SOG",
          data: [0, 0, 14, 4, 10],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
      ],
    },
    wingUpDownData: {
      labels: ["Up", "Down"],
      datasets: [
        {
          data: [90, 10],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
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
                  {ship.name}
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
                Type: <span className="text-white">{selectedShip.type}</span>
              </p>
              <p className="text-gray-400">
                Status:{" "}
                <span className="text-white">{selectedShip.status}</span>
              </p>
              <p className="text-gray-400">
                Speed:{" "}
                <span className="text-white">{selectedShip.speed} knots</span>
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
                  {selectedShip.position.latitude},{" "}
                  {selectedShip.position.longitude}
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
              <h3 className="text-lg font-semibold">Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    selectedShip.status === "En Route"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span>{selectedShip.status}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wing Rotation Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Wing Rotation Angle Distribution */}
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Wing Rotation Angle Distribution
            </h3>
            <div className="h-[300px]">
              <Bar data={selectedShip.wingRotationData} options={barOptions} />
            </div>
          </div>

          {/* Wing Up/Down Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Wing Position Distribution
            </h3>
            <div className="h-[300px]">
              <Pie
                data={selectedShip.wingUpDownData}
                options={doughnutOptions}
              />
            </div>
          </div>
        </div>

        {/* Navigation Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Wind Speed Over Time */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Wind Speed Over Time</h3>
            <div className="h-[300px]">
              <Line data={selectedShip.windSpeedData} options={chartOptions} />
            </div>
          </div>

          {/* COG Over Time */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Course Over Ground (COG)
            </h3>
            <div className="h-[300px]">
              <Line data={selectedShip.cogData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* SOG Chart */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Speed Over Ground (SOG)
          </h3>
          <div className="h-[300px]">
            <Line data={selectedShip.sogData} options={chartOptions} />
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
