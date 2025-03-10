import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Ship, Anchor, Navigation, Fuel, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Line, Pie, Bar } from "react-chartjs-2";
import StatCard from "../components/shared/StatCard";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { shipService } from "../services/shipService";

// Create custom ship icon
const createShipIcon = (color) => {
  const shipSvg = renderToString(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width={34}
      height={34}
    >
      <path d="M9 4H14.4458C14.7905 4 15.111 4.17762 15.2938 4.47L18.75 10H23.1577C23.4339 10 23.6577 10.2239 23.6577 10.5C23.6577 10.5837 23.6367 10.666 23.5967 10.7394L19.6599 17.9568C19.444 17.9853 19.2237 18 19 18C17.3644 18 15.9122 17.2147 15 16.0005C14.0878 17.2147 12.6356 18 11 18C9.3644 18 7.91223 17.2147 7 16.0005C6.08777 17.2147 4.6356 18 3 18C2.81381 18 2.63 17.9898 2.44909 17.97L1.21434 11.1789C1.11555 10.6355 1.47595 10.1149 2.01933 10.0161C2.07835 10.0054 2.13822 10 2.19821 10H3V5C3 4.44772 3.44772 4 4 4H5V1H9V4ZM5 10H16.3915L13.8915 6H5V10ZM3 20C4.53671 20 5.93849 19.4223 7 18.4722C8.06151 19.4223 9.46329 20 11 20C12.5367 20 13.9385 19.4223 15 18.4722C16.0615 19.4223 17.4633 20 19 20H21V22H19C17.5429 22 16.1767 21.6104 15 20.9297C13.8233 21.6104 12.4571 22 11 22C9.54285 22 8.17669 21.6104 7 20.9297C5.82331 21.6104 4.45715 22 3 22H1V20H3Z"></path>
    </svg>
  );
  return L.divIcon({
    html: shipSvg,
    className: "custom-ship-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Create custom pin icon
const createPinIcon = (color) => {
  const pinSvg = renderToString(
    <MapPin style={{ color: "black", fill: "white" }} />
  );
  return L.divIcon({
    html: pinSvg,
    className: "custom-pin-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

// Add custom icon styles
const iconStyle = `
  .custom-ship-icon, .custom-pin-icon {
    background: none;
    border: none;
  }
  .custom-ship-icon svg, .custom-pin-icon svg {
    width: 24px;
    height: 24px;
  }
`;

const DashboardPage = () => {
  const [ships, setShips] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [shipsData, stats, charts] = await Promise.all([
          shipService.getAllShips(),
          shipService.getDashboardStats(),
          shipService.getChartData(),
        ]);

        setShips(shipsData);
        setDashboardStats(stats);
        setChartData(charts);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

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
            value={dashboardStats.activeShips}
            color="#6366f1"
          />
          <StatCard
            name="Total Cargo"
            icon={Anchor}
            value={dashboardStats.totalCargo}
            color="#8B5CF6"
          />
          <StatCard
            name="Fuel Consumption"
            icon={Fuel}
            value={dashboardStats.fuelConsumption}
            color="#EC4899"
          />
          <StatCard
            name="Average Speed"
            icon={Navigation}
            value={dashboardStats.avgSpeed}
            color="#10B981"
          />
        </motion.div>

        {/* World Map */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Ship Locations & Routes
          </h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <style>{iconStyle}</style>
            <MapContainer
              center={[40, -50]}
              zoom={3}
              style={{ height: "100%", width: "100%" }}
              minZoom={2}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {ships.map((ship) => (
                <React.Fragment key={ship.id}>
                  {/* Current Position with Ship Icon */}
                  <Marker
                    position={[ship.position.latitude, ship.position.longitude]}
                    icon={createShipIcon(ship.color)}
                    zIndexOffset={1000}
                  >
                    <Popup>
                      <div className="text-gray-900">
                        <h3 className="font-bold">{ship.name}</h3>
                        <p>IMO: {ship.imo}</p>
                        <p>Status: {ship.status}</p>
                        <p>
                          Wind Speed: {ship.statistics.wind_speed.avg} knots
                        </p>
                        <p className="text-xs text-gray-600">
                          (min: {ship.statistics.wind_speed.min}, max:{" "}
                          {ship.statistics.wind_speed.max})
                        </p>
                        <p>Fan Speed: {ship.statistics.fan_speed.avg}</p>
                        <p className="text-xs text-gray-600">
                          (min: {ship.statistics.fan_speed.min}, max:{" "}
                          {ship.statistics.fan_speed.max})
                        </p>
                        <p>Destination: {ship.destination}</p>
                        <p>ETA: {ship.eta}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Start Point Pin */}
                  <Marker
                    position={ship.path[0]}
                    icon={createPinIcon(ship.color)}
                    zIndexOffset={100}
                  >
                    <Popup>
                      <div className="text-gray-900">
                        <h3 className="font-bold">Departure Port</h3>
                        <p>{ship.name}</p>
                        <p className="text-sm text-gray-600">IMO: {ship.imo}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* End Point Pin */}
                  <Marker
                    position={ship.path[ship.path.length - 1]}
                    icon={createPinIcon(ship.color)}
                    zIndexOffset={100}
                  >
                    <Popup>
                      <div className="text-gray-900">
                        <h3 className="font-bold">Destination</h3>
                        <p>{ship.destination}</p>
                        <p className="text-sm text-gray-600">ETA: {ship.eta}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Path Line */}
                  <Polyline
                    positions={ship.path}
                    color={ship.color}
                    weight={3}
                    opacity={0.7}
                    dashArray="2, 8, 12, 8"
                    dashOffset="0"
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
              <Pie data={chartData.shipTypes} options={pieOptions} />
            </div>
          </div>

          {/* Monthly Cargo Volume */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Cargo Volume</h3>
            <div className="h-[300px]">
              <Bar data={chartData.monthlyCargoVolume} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Fuel Efficiency Trend */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Fleet Fuel Efficiency Trend
          </h3>
          <div className="h-[300px]">
            <Line data={chartData.fuelEfficiency} options={chartOptions} />
          </div>
        </div>

        {/* Ships Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {ships.map((ship) => (
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
                  <Ship
                    className="w-6 h-6 mr-3"
                    style={{ color: ship.color }}
                  />
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
