import React, { useState, useRef, useEffect } from "react";
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
import { Ship, Anchor, Navigation, ChevronDown, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { shipService } from "../services/shipService";
import { useMockMode } from "../context/MockModeContext";
import MockModeToggle from "../components/shared/MockModeToggle";

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

// Map Controller Component to handle map updates
const MapController = ({ center }) => {
  const map = useMap();

  React.useEffect(() => {
    if (map) map.setView(center, 5);
  }, [center, map]);

  return null;
};

const ShipsPage = () => {
  const { isMockMode } = useMockMode();
  const [selectedShip, setSelectedShip] = useState(null);
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        setLoading(true);
        setError(null);
        const shipsData = await shipService.getAllShips(isMockMode);
        setShips(shipsData);
        setSelectedShip(shipsData[0]);
      } catch (err) {
        setError(
          !isMockMode
            ? "Failed to fetch live data. Please check your API connection or switch to Mock Mode."
            : "Failed to load ships data"
        );
        console.error("Ships data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShips();
  }, [isMockMode]);

  // Function to handle ship selection
  const handleShipChange = (e) => {
    const newSelectedShip = ships.find((s) => s.id === Number(e.target.value));
    setSelectedShip(newSelectedShip);
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading ships data...</div>
        </div>
        <MockModeToggle />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <MockModeToggle />
      </div>
    );
  }

  if (!selectedShip) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">No ships available</div>
        </div>
        <MockModeToggle />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Ships Management</h1>
          <div className="relative">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 appearance-none w-full text-white"
              value={selectedShip.id}
              onChange={handleShipChange}
            >
              {ships.map((ship) => (
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
              <Ship
                className="w-6 h-6 mr-3"
                style={{ color: selectedShip.color }}
              />
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
                style={{ color: selectedShip.color }}
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
              <Anchor
                className="w-6 h-6 mr-3"
                style={{ color: selectedShip.color }}
              />
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

        {/* Ship Map */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ship Location & Route</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <style>{iconStyle}</style>
            <MapContainer
              center={[
                selectedShip.position.latitude,
                selectedShip.position.longitude,
              ]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              minZoom={2}
            >
              <MapController
                center={[
                  selectedShip.position.latitude,
                  selectedShip.position.longitude,
                ]}
              />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Current Position with Ship Icon */}
              <Marker
                position={[
                  selectedShip.position.latitude,
                  selectedShip.position.longitude,
                ]}
                icon={createShipIcon(selectedShip.color)}
                zIndexOffset={1000}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h3 className="font-bold">{selectedShip.name}</h3>
                    <p>IMO: {selectedShip.imo}</p>
                    <p>Status: {selectedShip.status}</p>
                    <p>
                      Position: {selectedShip.position.latitude.toFixed(4)}°N,{" "}
                      {selectedShip.position.longitude.toFixed(4)}°E
                    </p>
                    <p>
                      Wind Speed: {selectedShip.statistics.wind_speed.avg} knots
                    </p>
                    <p className="text-xs text-gray-600">
                      (min: {selectedShip.statistics.wind_speed.min}, max:{" "}
                      {selectedShip.statistics.wind_speed.max})
                    </p>
                    <p>Fan Speed: {selectedShip.statistics.fan_speed.avg}</p>
                    <p className="text-xs text-gray-600">
                      (min: {selectedShip.statistics.fan_speed.min}, max:{" "}
                      {selectedShip.statistics.fan_speed.max})
                    </p>
                    <p>Destination: {selectedShip.destination}</p>
                    <p>ETA: {selectedShip.eta}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Start Point Pin */}
              <Marker
                position={selectedShip.path[0]}
                icon={createPinIcon(selectedShip.color)}
                zIndexOffset={100}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h3 className="font-bold">Departure Port</h3>
                    <p>{selectedShip.name}</p>
                    <p className="text-sm text-gray-600">
                      IMO: {selectedShip.imo}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* End Point Pin */}
              <Marker
                position={selectedShip.path[selectedShip.path.length - 1]}
                icon={createPinIcon(selectedShip.color)}
                zIndexOffset={100}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h3 className="font-bold">Destination</h3>
                    <p>{selectedShip.destination}</p>
                    <p className="text-sm text-gray-600">
                      ETA: {selectedShip.eta}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Path Line */}
              <Polyline
                positions={selectedShip.path}
                color={selectedShip.color}
                weight={3}
                opacity={0.7}
                dashArray="2, 8, 12, 8"
                dashOffset="0"
              />
            </MapContainer>
          </div>
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
      <MockModeToggle />
    </div>
  );
};

export default ShipsPage;
