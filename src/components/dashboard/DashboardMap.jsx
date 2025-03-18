import React, { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createShipIcon, createPinIcon, iconStyle } from "./MapIcons";

// Map controller component to update view when ships change
const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const DashboardMap = ({
  ships,
  selectedShip,
  onShipSelect,
  mapRef,
  startDate,
  endDate,
}) => {
  // Calculate the center point based on all ship positions
  const { mapCenter, mapZoom, shipsWithPosition } = useMemo(() => {
    // Filter out ships without position data
    const validShips = ships.filter(
      (ship) =>
        ship.position &&
        typeof ship.position.latitude === "number" &&
        typeof ship.position.longitude === "number"
    );

    if (validShips.length === 0) {
      // Default center if no valid ships
      return {
        mapCenter: [20, 0],
        mapZoom: 2,
        shipsWithPosition: [],
      };
    }

    // If only one ship, center on that ship
    if (validShips.length === 1) {
      return {
        mapCenter: [
          validShips[0].position.latitude,
          validShips[0].position.longitude,
        ],
        mapZoom: 5,
        shipsWithPosition: validShips,
      };
    }

    // For multiple ships, calculate the bounding box
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;

    validShips.forEach((ship) => {
      const lat = ship.position.latitude;
      const lng = ship.position.longitude;

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);

      // Also check path points if available
      if (ship.path && ship.path.length > 0) {
        ship.path.forEach((point) => {
          if (point && point.length === 2) {
            minLat = Math.min(minLat, point[0]);
            maxLat = Math.max(maxLat, point[0]);
            minLng = Math.min(minLng, point[1]);
            maxLng = Math.max(maxLng, point[1]);
          }
        });
      }
    });

    // Calculate center of the bounding box
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate appropriate zoom level based on the bounding box size
    // This is a simple approximation, might need adjustment
    const latDiff = Math.abs(maxLat - minLat);
    const lngDiff = Math.abs(maxLng - minLng);
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 13; // Max zoom
    if (maxDiff > 45) zoom = 1; // Global view
    else if (maxDiff > 20) zoom = 2; // Continental view
    else if (maxDiff > 10) zoom = 3; // Country view
    else if (maxDiff > 5) zoom = 4; // Region view
    else if (maxDiff > 2) zoom = 5; // Area view
    else if (maxDiff > 1) zoom = 6; // City view
    else if (maxDiff > 0.5) zoom = 7;
    else if (maxDiff > 0.1) zoom = 9;
    else if (maxDiff > 0.05) zoom = 10;
    else if (maxDiff > 0.01) zoom = 12;

    return {
      mapCenter: [centerLat, centerLng],
      mapZoom: zoom,
      shipsWithPosition: validShips,
    };
  }, [ships]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-4 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ship Locations & Routes</h2>
        {startDate && endDate && (
          <div className="text-sm text-gray-300 mt-1 md:mt-0">
            Showing data from {formatDate(startDate)} to {formatDate(endDate)}
          </div>
        )}
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <style>{iconStyle}</style>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          minZoom={1.5}
          ref={mapRef}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Land layer */}
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            zIndex={1}
          />
          {/* OpenSeaMap layer */}
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            zIndex={2}
          />

          {/* Ship markers and routes */}
          {shipsWithPosition.map((ship) => (
            <React.Fragment key={ship.id}>
              {/* Start Position Pin */}
              {ship.path?.length > 0 && (
                <Marker
                  position={ship.path[0]}
                  icon={createPinIcon()}
                  zIndexOffset={900}
                >
                  <Popup>
                    <div className="text-gray-900">
                      <h3 className="font-bold">{ship.name} - Start Point</h3>
                      <p>IMO: {ship.imo}</p>
                      <p>
                        Position: {ship.path[0][0].toFixed(4)}°N,{" "}
                        {ship.path[0][1].toFixed(4)}°E
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Current Position with Ship Icon */}
              <Marker
                position={[
                  ship.position?.latitude || 0,
                  ship.position?.longitude || 0,
                ]}
                icon={createShipIcon()}
                zIndexOffset={1000}
                eventHandlers={{
                  click: () => onShipSelect(ship),
                }}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h3 className="font-bold">{ship.name}</h3>
                    <p>IMO: {ship.imo}</p>
                    <p>Status: {ship.status}</p>
                    <p>
                      Position: {ship.position?.latitude?.toFixed(4)}°N,{" "}
                      {ship.position?.longitude?.toFixed(4)}°E
                    </p>
                    <p>Wind Speed: {ship.statistics?.wind_speed?.avg} knots</p>
                    <p>Fan Speed: {ship.statistics?.fan_speed?.avg}</p>
                    <p>Destination: {ship.destination}</p>
                    <p>ETA: {ship.eta}</p>
                  </div>
                </Popup>
              </Marker>

              {/* End Position Pin */}
              {ship.path?.length > 1 && (
                <Marker
                  position={ship.path[ship.path.length - 1]}
                  icon={createPinIcon()}
                  zIndexOffset={900}
                >
                  <Popup>
                    <div className="text-gray-900">
                      <h3 className="font-bold">{ship.name} - End Point</h3>
                      <p>IMO: {ship.imo}</p>
                      <p>
                        Position:{" "}
                        {ship.path[ship.path.length - 1][0].toFixed(4)}°N,{" "}
                        {ship.path[ship.path.length - 1][1].toFixed(4)}°E
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Simple Route Line */}
              {ship.path?.length > 1 && (
                <Polyline
                  positions={ship.path}
                  color={ship.color}
                  weight={3}
                  opacity={selectedShip?.id === ship.id ? 0.9 : 0.4}
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DashboardMap;
