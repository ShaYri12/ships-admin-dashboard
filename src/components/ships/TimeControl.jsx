import React, { useRef, useEffect, useState } from "react";

const TimeControl = ({ ship, currentTimeIndex, onTimeChange }) => {
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // Update slider width on mount and window resize
  useEffect(() => {
    const updateSliderWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };

    updateSliderWidth();
    window.addEventListener("resize", updateSliderWidth);

    return () => {
      window.removeEventListener("resize", updateSliderWidth);
    };
  }, []);

  const handleSliderChange = (e) => {
    // Get the clicked value directly from the event
    const clickedValue = parseFloat(e.target.value);
    onTimeChange(clickedValue);
  };

  // Direct click on a specific time point
  const handleTickClick = (index) => {
    if (!ship?.timeSeriesData?.length) return;
    const value = (index / (ship.timeSeriesData.length - 1)) * 100;
    onTimeChange(value);
  };

  // Get the current timestamp from the time series data
  const currentTimestamp = ship?.timeSeriesData?.[currentTimeIndex]?.timestamp;

  // Format the timestamp for display
  const formattedTime = currentTimestamp
    ? new Date(currentTimestamp).toLocaleString()
    : "No data";

  // Calculate the slider value based on current index
  const sliderValue =
    ship?.timeSeriesData?.length > 1
      ? (currentTimeIndex / (ship.timeSeriesData.length - 1)) * 100
      : 0;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg z-[1000]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white">Time Control</span>
        <span className="text-sm text-white">{formattedTime}</span>
      </div>

      {/* Custom slider with dots */}
      <div className="mb-6 mt-4" ref={sliderRef}>
        {/* Track with dots */}
        <div className="relative w-full h-2 bg-gray-700 rounded-lg mb-4">
          {/* Dots for each data point */}
          {ship?.timeSeriesData?.map((point, index) => {
            // Calculate position as percentage
            const position = (index / (ship.timeSeriesData.length - 1)) * 100;

            // Determine if this is the current point
            const isCurrent = index === currentTimeIndex;

            return (
              <div
                key={`dot-${index}`}
                className={`absolute w-1 h-1 rounded-full transform -translate-x-1/2 -translate-y-1/4 cursor-pointer ${
                  isCurrent
                    ? "bg-indigo-500 border-2 border-white"
                    : "bg-gray-400"
                }`}
                style={{ left: `${position}%`, top: "50%" }}
                onClick={() => handleTickClick(index)}
                title={new Date(point.timestamp).toLocaleString()}
              />
            );
          })}

          {/* Progress bar */}
          <div
            className="absolute h-2  rounded-l-lg"
            style={{
              width: `${sliderValue}%`,
              maxWidth: "100%",
              top: 0,
              left: 0,
            }}
          />

          {/* Thumb */}
          <div
            className="absolute w-5 h-5 bg-indigo-500 rounded-full border-2 border-white shadow transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${sliderValue}%`,
              top: "50%",
              zIndex: 10,
            }}
          />

          {/* Invisible range input for accessibility */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sliderValue}
            className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
            onChange={handleSliderChange}
            disabled={!ship?.timeSeriesData?.length}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => onTimeChange(0)}
          disabled={!ship?.timeSeriesData?.length || currentTimeIndex === 0}
        >
          Start
        </button>
        <button
          className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => onTimeChange(100)}
          disabled={
            !ship?.timeSeriesData?.length ||
            currentTimeIndex === ship?.timeSeriesData?.length - 1
          }
        >
          End
        </button>
      </div>
    </div>
  );
};

export default TimeControl;
