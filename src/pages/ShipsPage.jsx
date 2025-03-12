import React, { useState, useEffect } from "react";
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
import { shipService } from "../services/shipService";
import { useMockMode } from "../context/MockModeContext";
import MockModeToggle from "../components/shared/MockModeToggle";
import ShipDetails from "../components/ships/ShipDetails";
import NavigationInfo from "../components/ships/NavigationInfo";
import ShipStatistics from "../components/ships/ShipStatistics";
import ShipMap from "../components/ships/ShipMap";
import ShipSelector from "../components/ships/ShipSelector";
import RoutePointGraphs from "../components/ships/RoutePointGraphs";
import PerformanceCharts from "../components/ships/PerformanceCharts";
import { useNavigate } from "react-router-dom";

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

const ShipsPage = () => {
  const { isMockMode } = useMockMode();
  const [selectedShip, setSelectedShip] = useState(null);
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const navigate = useNavigate();

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

  // Handle time slider changes
  const handleTimeSliderChange = (value) => {
    if (!selectedShip?.timeSeriesData?.length) return;

    const index = Math.floor(
      (value / 100) * (selectedShip.timeSeriesData.length - 1)
    );
    setCurrentTimeIndex(index);
  };

  // Navigate to ship creation page
  const handleAddShip = () => {
    navigate("/ships/create");
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
          <div className="flex items-center space-x-4">
            <ShipSelector
              ships={ships}
              selectedShip={selectedShip}
              onShipChange={handleShipChange}
            />
            <button
              onClick={handleAddShip}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add New Ship
            </button>
          </div>
        </div>

        {/* Ship Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ShipDetails ship={selectedShip} />
          <NavigationInfo ship={selectedShip} />
          <ShipStatistics ship={selectedShip} />
        </div>

        {/* Ship Map */}
        <ShipMap
          ship={selectedShip}
          currentTimeIndex={currentTimeIndex}
          onTimeChange={handleTimeSliderChange}
        />

        {/* Route Point Data Graphs */}
        <RoutePointGraphs ship={selectedShip} />

        {/* Performance Charts */}
        <PerformanceCharts ship={selectedShip} />
      </div>
      <MockModeToggle />
    </div>
  );
};

export default ShipsPage;
