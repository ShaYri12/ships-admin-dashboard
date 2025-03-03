import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Ship, Anchor, Navigation, Fuel, Wind } from "lucide-react";
import { motion } from "framer-motion";
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
  },
  {
    id: 2,
    name: "Tanker Beta",
    position: [48.8566, 2.3522],
    status: "Docked",
    destination: "Hamburg",
    eta: "2024-03-15",
  },
];

// Mock stats data
const DASHBOARD_STATS = {
  activeShips: "12",
  totalCargo: "45,678 tons",
  fuelConsumption: "1,234 tons",
  avgSpeed: "18 knots",
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
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ship Locations</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[50, 0]}
              zoom={3.5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {MOCK_SHIPS.map((ship) => (
                <Marker key={ship.id} position={ship.position}>
                  <Popup>
                    <div className="text-gray-900">
                      <h3 className="font-bold">{ship.name}</h3>
                      <p>Status: {ship.status}</p>
                      <p>Destination: {ship.destination}</p>
                      <p>ETA: {ship.eta}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Ships Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
