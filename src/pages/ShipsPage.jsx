import React, { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
import { Ship, Anchor, Navigation } from "lucide-react";
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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Ships Management</h1>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
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
