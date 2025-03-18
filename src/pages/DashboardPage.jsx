import React, { useState, useEffect, useRef } from "react";
import { shipService } from "../services/shipService";
import { useMockMode } from "../context/MockModeContext";
import MockModeToggle from "../components/shared/MockModeToggle";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardMap from "../components/dashboard/DashboardMap";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import ShipOverview from "../components/dashboard/ShipOverview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardPage = () => {
  const { isMockMode } = useMockMode();
  const [ships, setShips] = useState([]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(1741281633 * 1000)); // Convert seconds to milliseconds
  const [endDate, setEndDate] = useState(new Date(1741317363 * 1000)); // Convert seconds to milliseconds
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching all available ship data`);

        // Get ships data from API - use a very broad date range to get all data
        const shipsData = await shipService.getAllShips(isMockMode);

        // Create a combined array to hold all ships with their specific data
        let allShipsData = [...shipsData];

        // Always fetch NBA Magritte data with its specific time range, regardless of current date selection
        try {
          console.log(
            "Fetching NBA Magritte data with its specific time range"
          );
          const nbaMaritteStartTime = 1732669200000; // milliseconds
          const nbaMaritteEndTime = 1732845600000; // milliseconds

          const nbaMaritteShipData = await shipService.getShipStatistics(
            "9512331",
            Math.floor(nbaMaritteStartTime / 1000),
            Math.floor(nbaMaritteEndTime / 1000),
            isMockMode
          );

          if (nbaMaritteShipData) {
            // Find and replace or add NBA Magritte in the ships array
            const nbaIndex = allShipsData.findIndex(
              (ship) => ship.imo === "9512331"
            );

            if (nbaIndex >= 0) {
              // Replace existing entry with the one that has proper data
              allShipsData[nbaIndex] = {
                ...nbaMaritteShipData,
                hasData: true,
              };
              console.log("Updated NBA Magritte with its specific data");
            } else {
              // Add new entry if not found
              allShipsData.push({
                ...nbaMaritteShipData,
                hasData: true,
              });
              console.log("Added NBA Magritte with its specific data");
            }
          }
        } catch (nbaError) {
          console.warn(
            "Could not fetch specific data for NBA Magritte:",
            nbaError
          );
          // Still keep any placeholder NBA Magritte in the list
        }

        // Always fetch Amadeus Saffier data with its specific time range
        try {
          console.log(
            "Fetching Amadeus Saffier data with its specific time range"
          );
          const amadeusSaffierStartTime = 1741281633 * 1000; // milliseconds
          const amadeusSaffierEndTime = 1741317363 * 1000; // milliseconds

          const amadeusSaffierShipData = await shipService.getShipStatistics(
            "9996903",
            Math.floor(amadeusSaffierStartTime / 1000),
            Math.floor(amadeusSaffierEndTime / 1000),
            isMockMode
          );

          if (amadeusSaffierShipData) {
            // Find and replace or add Amadeus Saffier in the ships array
            const amadeusSaffierIndex = allShipsData.findIndex(
              (ship) => ship.imo === "9996903"
            );

            if (amadeusSaffierIndex >= 0) {
              // Replace existing entry
              allShipsData[amadeusSaffierIndex] = {
                ...amadeusSaffierShipData,
                hasData: true,
              };
              console.log("Updated Amadeus Saffier with its specific data");
            } else {
              // Add new entry
              allShipsData.push({
                ...amadeusSaffierShipData,
                hasData: true,
              });
              console.log("Added Amadeus Saffier with its specific data");
            }
          }
        } catch (amadeusSaffierError) {
          console.warn(
            "Could not fetch specific data for Amadeus Saffier:",
            amadeusSaffierError
          );
          // Still keep any placeholder Amadeus Saffier in the list
        }

        // Ensure each ship has the right properties for the dashboard
        allShipsData = allShipsData.map((ship) => ({
          ...ship,
          // If the ship is missing some required properties, ensure they have defaults
          position: ship.position || { latitude: 52.3708, longitude: 4.8958 },
          path: ship.path || [],
          timeSeriesData: ship.timeSeriesData || [],
          statistics: ship.statistics || {
            wind_speed: { avg: 0, min: 0, max: 0 },
            fan_speed: { avg: 0, min: 0, max: 0 },
          },
          hasData:
            ship.hasData !== undefined
              ? ship.hasData
              : Boolean(ship.timeSeriesData?.length),
        }));

        console.log(
          `Loaded ${allShipsData.length} ships, including ships with specific date ranges`
        );

        // Set the ships data
        setShips(allShipsData);

        // Set initial selected ship - prefer NBA Magritte if available
        if (allShipsData.length > 0 && !selectedShip) {
          const nbaMaritteShip = allShipsData.find(
            (ship) => ship.imo === "9512331" && ship.hasData
          );
          const amadeusSaffierShip = allShipsData.find(
            (ship) => ship.imo === "9996903" && ship.hasData
          );
          setSelectedShip(
            nbaMaritteShip || amadeusSaffierShip || allShipsData[0]
          );
        }

        // Calculate dashboard stats from all the ships data
        const stats = {
          activeShips: allShipsData.length.toString(),
          totalCargo: isMockMode
            ? "45,678 tons"
            : calculateTotalCargo(allShipsData),
          fuelConsumption: isMockMode
            ? "1,234 tons"
            : calculateFuelConsumption(allShipsData),
          avgSpeed: `${(
            allShipsData.reduce(
              (acc, ship) => acc + (ship.statistics?.wind_speed?.avg || 0),
              0
            ) / Math.max(1, allShipsData.length)
          ).toFixed(1)} knots`,
        };

        // Create chart data based on all ships data
        const charts = isMockMode
          ? getMockChartData()
          : generateChartsFromApiData(allShipsData);

        setDashboardStats(stats);
        setChartData(charts);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError(`Failed to fetch ship data: ${err.message}`);

        // Only clear data when there's an error and we have no existing data
        if (ships.length === 0) {
          setDashboardStats(null);
          setChartData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isMockMode]); // Only dependent on mock mode, not on date range

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start || new Date(1741281633 * 1000));
    setEndDate(end || new Date(1741317363 * 1000));
    // Don't re-fetch data when date range changes - this is just for display
  };

  // Helper function to handle ship selection
  const handleShipSelect = (ship) => {
    setSelectedShip(ship);

    // If selecting NBA Magritte, use its specific date range for display
    if (ship.imo === "9512331") {
      const nbaStartDate = new Date(1732669200000);
      const nbaEndDate = new Date(1732845600000);
      setStartDate(nbaStartDate);
      setEndDate(nbaEndDate);
    }
    // If selecting Amadeus Saffier, use its specific date range for display
    else if (ship.imo === "9996903") {
      const amadeusSaffierStartDate = new Date(1741281633 * 1000);
      const amadeusSaffierEndDate = new Date(1741317363 * 1000);
      setStartDate(amadeusSaffierStartDate);
      setEndDate(amadeusSaffierEndDate);
    }
  };

  // Helper function to calculate total cargo from ship data
  const calculateTotalCargo = (ships) => {
    // In a real implementation, this would calculate based on actual cargo data
    // For now, we'll return a placeholder since we don't have real cargo data
    return "Based on API data";
  };

  // Helper function to calculate fuel consumption from ship data
  const calculateFuelConsumption = (ships) => {
    // In a real implementation, this would calculate based on actual fuel data
    // For now, we'll return a placeholder since we don't have real fuel data
    return "Based on API data";
  };

  // Helper function to generate chart data from API data
  const generateChartsFromApiData = (ships) => {
    // Count ship types
    const shipTypes = ships.reduce((acc, ship) => {
      acc[ship.type] = (acc[ship.type] || 0) + 1;
      return acc;
    }, {});

    // Extract wind speed data for charts
    const windSpeedData = ships.flatMap(
      (ship) =>
        ship.timeSeriesData?.map((point) => ({
          timestamp: new Date(point.timestamp),
          windSpeed: point.wind_speed,
        })) || []
    );

    // Sort by timestamp
    windSpeedData.sort((a, b) => a.timestamp - b.timestamp);

    // Group by month for monthly data
    const monthlyData = windSpeedData.reduce((acc, data) => {
      const month = data.timestamp.toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = { count: 0, total: 0 };
      }
      acc[month].count += 1;
      acc[month].total += data.windSpeed;
      return acc;
    }, {});

    // Calculate monthly averages
    const months = Object.keys(monthlyData);
    const monthlyAverages = months.map(
      (month) => monthlyData[month].total / monthlyData[month].count
    );

    return {
      shipTypes: {
        labels: Object.keys(shipTypes),
        datasets: [
          {
            data: Object.values(shipTypes),
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
        labels: months,
        datasets: [
          {
            label: "Wind Speed (knots)",
            data: monthlyAverages,
            backgroundColor: "rgba(99, 102, 241, 0.8)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 2,
          },
        ],
      },
      fuelEfficiency: {
        labels: months,
        datasets: [
          {
            label: "Wind Speed Trend",
            data: monthlyAverages,
            borderColor: "rgba(236, 72, 153, 1)",
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
    };
  };

  // Get mock chart data for development
  const getMockChartData = () => {
    return {
      shipTypes: {
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
  };

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

  if (error && ships.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            {!isMockMode && (
              <div className="mt-4">
                <p className="font-semibold">Suggestions:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Check your API connection</li>
                  <li>Verify the API endpoint is correct</li>
                  <li>Ensure you have the correct IMO numbers configured</li>
                  <li>Try switching to Mock Mode to see sample data</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <MockModeToggle />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Ships Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white">Date Range:</span>
            <DatePicker
              selected={startDate}
              onChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              className="bg-gray-700 text-white text-sm rounded-md px-2 py-1"
              placeholderText="Select date range"
              dateFormat="MMM d, yyyy"
            />
          </div>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-2">Warning</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <DashboardStats stats={dashboardStats} />

        {/* World Map */}
        <DashboardMap
          ships={ships}
          selectedShip={selectedShip}
          onShipSelect={handleShipSelect}
          mapRef={mapRef}
          startDate={startDate}
          endDate={endDate}
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
