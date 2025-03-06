import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Ship, Anchor, Navigation, Fuel, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { Line, Pie, Bar } from "react-chartjs-2";
import StatCard from "../components/shared/StatCard";

// Mock data - will be replaced with API data later
const MOCK_SHIPS = [
  {
    id: 1,
    name: "Cargo Ship Alpha",
    position: [51.505, -0.09],
    status: "En Route",
    destination: "Rotterdam",
    eta: "2024-03-10",
    path: [
      [51.505, -0.09],
      [51.6, -0.5],
      [51.8, -1.0],
      [52.0, -1.5],
      [52.2, -2.0],
    ],
  },
  {
    id: 2,
    name: "Tanker Beta",
    position: [48.8566, 2.3522],
    status: "Docked",
    destination: "Hamburg",
    eta: "2024-03-15",
    path: [
      [48.8566, 2.3522],
      [49.0, 2.5],
      [49.2, 2.8],
      [49.5, 3.0],
      [49.8, 3.2],
    ],
  },
];

// Mock stats data
const DASHBOARD_STATS = {
  activeShips: "12",
  totalCargo: "45,678 tons",
  fuelConsumption: "1,234 tons",
  avgSpeed: "18 knots",
};

// Chart data
const shipTypeData = {
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
};

const monthlyCargoData = {
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
};

const fuelEfficiencyData = {
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
};

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

const pieOptions = {
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

const DashboardPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ships Dashboard</h1>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Active Ships"
            icon={Ship}
            value={DASHBOARD_STATS.activeShips}
            color="#6366f1"
          />
          <StatCard
            name="Total Cargo"
            icon={Anchor}
            value={DASHBOARD_STATS.totalCargo}
            color="#8B5CF6"
          />
          <StatCard
            name="Fuel Consumption"
            icon={Fuel}
            value={DASHBOARD_STATS.fuelConsumption}
            color="#EC4899"
          />
          <StatCard
            name="Average Speed"
            icon={Navigation}
            value={DASHBOARD_STATS.avgSpeed}
            color="#10B981"
          />
        </motion.div>

        {/* World Map */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Ship Locations & Routes
          </h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[50.5, 0]}
              zoom={6.4}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {MOCK_SHIPS.map((ship) => (
                <React.Fragment key={ship.id}>
                  <Marker position={ship.position}>
                    <Popup>
                      <div className="text-gray-900">
                        <h3 className="font-bold">{ship.name}</h3>
                        <p>Status: {ship.status}</p>
                        <p>Destination: {ship.destination}</p>
                        <p>ETA: {ship.eta}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={ship.path}
                    color="#6366f1"
                    weight={3}
                    opacity={0.7}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ship Types Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Fleet Distribution</h3>
            <div className="h-[300px]">
              <Pie data={shipTypeData} options={pieOptions} />
            </div>
          </div>

          {/* Monthly Cargo Volume */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Cargo Volume</h3>
            <div className="h-[300px]">
              <Bar data={monthlyCargoData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Fuel Efficiency Trend */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Fleet Fuel Efficiency Trend
          </h3>
          <div className="h-[300px]">
            <Line data={fuelEfficiencyData} options={chartOptions} />
          </div>
        </div>

        {/* Ships Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {MOCK_SHIPS.map((ship) => (
            <motion.div
              key={ship.id}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Ship className="w-6 h-6 mr-3" style={{ color: "#6366f1" }} />
                  <h3 className="text-lg font-semibold">{ship.name}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Status: <span className="text-white">{ship.status}</span>
                  </p>
                  <p className="text-gray-400">
                    Destination:{" "}
                    <span className="text-white">{ship.destination}</span>
                  </p>
                  <p className="text-gray-400">
                    ETA: <span className="text-white">{ship.eta}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
