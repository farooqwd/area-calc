"use client";

import React, { useState } from "react";
import * as turf from "@turf/turf";

const AreaCalculator = () => {
  const [coordinates, setCoordinates] = useState([]); // Array to store marked coordinates
  const [area, setArea] = useState(null); // Area result
  const [locationError, setLocationError] = useState(null); // Error for location access

  // Function to mark coordinates using the smartphone's GPS
  const markCoordinate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const newPoint = [longitude, latitude];
          setCoordinates((prevCoords) => [...prevCoords, newPoint]);

          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to fetch location. Please allow location access.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  // Function to calculate the area
  const calculateArea = () => {
    if (coordinates.length < 3) {
      alert("At least 3 coordinates are required to calculate the area.");
      return;
    }

    // Close the polygon by adding the first point to the end
    const closedCoordinates = [...coordinates, coordinates[0]];

    // Create a polygon
    const polygon = turf.polygon([closedCoordinates]);

    // Calculate the area in square meters
    const calculatedArea = turf.area(polygon);
    setArea(calculatedArea.toFixed(2)); // Round the area to 2 decimal places
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Area Calculator</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={markCoordinate}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Mark Coordinate
        </button>

        <button
          onClick={calculateArea}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Calculate Area 3
        </button>
      </div>

      {locationError && <p style={{ color: "red" }}>{locationError}</p>}

      <h3>Marked Coordinates:</h3>
      <ul>
        {coordinates.map((coord, index) => (
          <li key={index}>
            Point {index + 1}: Lat: {coord[1]}, Lng: {coord[0]}
          </li>
        ))}
      </ul>

      {area && (
        <div style={{ marginTop: "20px" }}>
          <h2>
            Calculated Area: <span style={{ color: "green" }}>{area} m²</span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default AreaCalculator;
