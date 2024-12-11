'use client';

import { useState } from "react";
import * as turf from "@turf/turf";

const AreaCalculator = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [area, setArea] = useState(null);

  // Relaxed precision value for detecting duplicate coordinates
  const precision = 0.000001; // ~0.1 meter precision

  const markCoordinate = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoordinate = [longitude, latitude];

          // Check if the new coordinate is already in the list to avoid duplicates based on precision
          const isDuplicate = coordinates.some((coord) => {
            return (
              Math.abs(coord[0] - newCoordinate[0]) < precision &&
              Math.abs(coord[1] - newCoordinate[1]) < precision
            );
          });

          if (isDuplicate) {
            alert("You are already at this location!");
          } else {
            setCoordinates([...coordinates, newCoordinate]);
            // Stop watching after capturing the coordinate
            navigator.geolocation.clearWatch(watchId);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          alert("Unable to fetch location. Please enable location services.");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const calculateArea = () => {
    if (coordinates.length < 3) {
      alert("You need at least 3 coordinates to calculate the area.");
      return;
    }

    // Close the polygon by connecting the last point to the first
    const closedCoordinates = [...coordinates, coordinates[0]];

    const polygon = turf.polygon([closedCoordinates]);
    const calculatedArea = turf.area(polygon); // Area in square meters
    setArea(calculatedArea);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Area Calculator</h1>
      <button
        onClick={markCoordinate}
        style={{
          margin: "10px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Mark Coordinate test 2
      </button>
      <button
        onClick={calculateArea}
        style={{
          margin: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit & Calculate Area
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Marked Coordinates:</h3>
        <ul>
          {coordinates.map((coord, index) => (
            <li key={index}>
              Lat: {coord[1]}, Lng: {coord[0]}
            </li>
          ))}
        </ul>
      </div>

      {area !== null && (
        <div style={{ marginTop: "20px" }}>
          <h2>Calculated Area:</h2>
          <p>{area.toFixed(2)} square meters</p>
        </div>
      )}
    </div>
  );
};

export default AreaCalculator;
