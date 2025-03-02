import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Ship, Anchor, Navigation } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
          tension: 0.4,
        },
        {
          label: "Speed (knots)",
          data: [28, 48, 40, 19, 86, 27],
          borderColor: "#8B5CF6",
          tension: 0.4,
        },
      ],
    },
  },
  // Add more mock ships here
];

const ShipsPage = () => {
  const [selectedShip, setSelectedShip] = useState(MOCK_SHIPS[0]);

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
          <div className="bg-gray-800 rounded-lg p-6">
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
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
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
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
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
          </div>
        </div>

        {/* Performance Graphs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="h-[400px]">
            <Line
              data={selectedShip.performanceData}
              options={{
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipsPage;
