import React from "react";
import { ChevronDown } from "lucide-react";

const ShipSelector = ({ ships, selectedShip, onShipChange }) => {
  return (
    <div className="relative">
      <select
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 appearance-none w-full text-white"
        value={selectedShip.id}
        onChange={onShipChange}
      >
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>
            {ship.name} (IMO: {ship.imo})
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
        size={16}
      />
    </div>
  );
};

export default ShipSelector;
