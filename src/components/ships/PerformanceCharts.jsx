import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";

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

const PerformanceCharts = ({ ship }) => {
  return (
    <>
      {/* Wing Rotation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Wing Rotation Angle Distribution */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Wing Rotation Angle Distribution
          </h3>
          <div className="h-[300px]">
            <Bar data={ship.wingRotationData} options={barOptions} />
          </div>
        </div>

        {/* Wind Speed Over Time */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Wind Speed Over Time</h3>
          <div className="h-[300px]">
            <Line data={ship.windSpeedData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Metrics */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="h-[300px]">
            <Line data={ship.performanceData} options={chartOptions} />
          </div>
        </div>

        {/* Cargo Distribution */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Cargo Distribution</h3>
          <div className="h-[300px]">
            <Doughnut data={ship.cargoData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Maintenance Chart */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">
          Maintenance Hours by Department
        </h3>
        <div className="h-[300px]">
          <Bar data={ship.maintenanceData} options={chartOptions} />
        </div>
      </div>
    </>
  );
};

export default PerformanceCharts;
