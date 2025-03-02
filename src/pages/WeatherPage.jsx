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
import { Cloud, Wind, Thermometer, Droplets } from "lucide-react";

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

// Mock weather data - will be replaced with API data later
const MOCK_WEATHER_DATA = {
  temperature: {
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
        label: "Temperature (°C)",
        data: [22, 21, 20, 23, 25, 24, 22, 21],
        borderColor: "#6366f1",
        tension: 0.4,
      },
    ],
  },
  wind: {
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
        data: [15, 18, 20, 17, 16, 19, 21, 18],
        borderColor: "#8B5CF6",
        tension: 0.4,
      },
    ],
  },
  humidity: {
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
        label: "Humidity (%)",
        data: [65, 68, 70, 72, 68, 65, 67, 70],
        borderColor: "#EC4899",
        tension: 0.4,
      },
    ],
  },
};

const MOCK_SHIPS = [
  { id: 1, name: "Cargo Ship Alpha" },
  { id: 2, name: "Tanker Beta" },
];

const WeatherPage = () => {
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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Weather Conditions</h1>
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

        {/* Current Weather Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Thermometer
                className="w-6 h-6 mr-3"
                style={{ color: "#6366f1" }}
              />
              <h3 className="text-lg font-semibold">Temperature</h3>
            </div>
            <div className="text-3xl font-bold">22°C</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Wind className="w-6 h-6 mr-3" style={{ color: "#8B5CF6" }} />
              <h3 className="text-lg font-semibold">Wind Speed</h3>
            </div>
            <div className="text-3xl font-bold">15 knots</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Cloud className="w-6 h-6 mr-3" style={{ color: "#EC4899" }} />
              <h3 className="text-lg font-semibold">Conditions</h3>
            </div>
            <div className="text-3xl font-bold">Partly Cloudy</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Droplets className="w-6 h-6 mr-3" style={{ color: "#10B981" }} />
              <h3 className="text-lg font-semibold">Humidity</h3>
            </div>
            <div className="text-3xl font-bold">65%</div>
          </div>
        </div>

        {/* Weather Graphs */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Temperature Trend</h3>
            <div className="h-[300px]">
              <Line
                data={MOCK_WEATHER_DATA.temperature}
                options={chartOptions}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Wind Speed Trend</h3>
            <div className="h-[300px]">
              <Line data={MOCK_WEATHER_DATA.wind} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Humidity Trend</h3>
            <div className="h-[300px]">
              <Line data={MOCK_WEATHER_DATA.humidity} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
