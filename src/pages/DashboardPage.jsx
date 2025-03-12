import React, { useState, useEffect, useRef } from "react";
import { shipService } from "../services/shipService";
import { useMockMode } from "../context/MockModeContext";
import MockModeToggle from "../components/shared/MockModeToggle";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardMap from "../components/dashboard/DashboardMap";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import ShipOverview from "../components/dashboard/ShipOverview";

const DashboardPage = () => {
  const { isMockMode } = useMockMode();
  const [ships, setShips] = useState([]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get ships data from API
        const shipsData = await shipService.getAllShips(isMockMode);

        if (!isMockMode && (!shipsData || shipsData.length === 0)) {
          throw new Error(
            "No live ship data available. Please check your connection or switch to Mock Mode."
          );
        }

        // Set initial selected ship
        if (shipsData.length > 0 && !selectedShip) {
          setSelectedShip(shipsData[0]);
        }

        // Calculate dashboard stats from actual data
        const stats = {
          activeShips: shipsData.length.toString(),
          totalCargo: isMockMode ? "45,678 tons" : "Calculating...",
          fuelConsumption: isMockMode ? "1,234 tons" : "Calculating...",
          avgSpeed: `${(
            shipsData.reduce(
              (acc, ship) => acc + (ship.statistics?.wind_speed?.avg || 0),
              0
            ) / shipsData.length
          ).toFixed(1)} knots`,
        };

        const charts = {
          shipTypes: {
            labels: [
              "Cargo Ships",
              "Tankers",
              "Container Ships",
              "Bulk Carriers",
            ],
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
          },
          monthlyCargoVolume: {
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
          },
          fuelEfficiency: {
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
          },
        };

        setShips(shipsData);
        setDashboardStats(stats);
        setChartData(charts);
      } catch (err) {
        setError(
          !isMockMode
            ? `Failed to fetch live data: ${err.message}`
            : "Failed to load dashboard data"
        );
        console.error("Dashboard data error:", err);

        // Clear data when there's an error in live mode
        if (!isMockMode) {
          setShips([]);
          setDashboardStats(null);
          setChartData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isMockMode]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading dashboard data...</div>
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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ships Dashboard</h1>

        {/* Stats Cards */}
        <DashboardStats stats={dashboardStats} />

        {/* World Map */}
        <DashboardMap
          ships={ships}
          selectedShip={selectedShip}
          onShipSelect={setSelectedShip}
          mapRef={mapRef}
        />

        {/* Charts */}
        <DashboardCharts chartData={chartData} />

        {/* Ships Overview */}
        <ShipOverview ships={ships} />
      </div>
      <MockModeToggle />
    </div>
  );
};

export default DashboardPage;
