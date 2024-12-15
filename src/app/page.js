"use client";

import React, { useState } from "react";
import * as turf from "@turf/turf";

const AreaCalculator = () => {
  const [coordinates, setCoordinates] = useState([]); // Store marked coordinates
  const [area, setArea] = useState(null); // Store calculated area
  const [locationError, setLocationError] = useState(null); // Error handling

  // Function to mark precise coordinates
  const markCoordinate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = Number(position.coords.latitude.toFixed(7)); // Point precision
          const longitude = Number(position.coords.longitude.toFixed(7)); // Point precision

          const newPoint = [longitude, latitude];

          // Avoid adding duplicate points
          setCoordinates((prevCoords) => {
            if (
              prevCoords.length > 0 &&
              prevCoords[prevCoords.length - 1][0] === newPoint[0] &&
              prevCoords[prevCoords.length - 1][1] === newPoint[1]
            ) {
              alert("Point already marked, move to a new position.");
              return prevCoords;
            }
            return [...prevCoords, newPoint];
          });

          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to fetch location. Please allow location access.");
        },
        {
          enableHighAccuracy: true, // High precision GPS
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
    const calculatedAreaMeters = turf.area(polygon);

    // Convert the area to square feet (1 m² = 10.7639 ft²)
    const calculatedAreaFeet = calculatedAreaMeters * 10.7639;

    setArea({
      meters: calculatedAreaMeters.toFixed(2),
      feet: calculatedAreaFeet.toFixed(2),
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "10px" }}>High Precision Area Calculator</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={markCoordinate}
          style={{
            padding: "10px 20px",
            margin: "5px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Mark Coordinate
        </button>

        <button
          onClick={calculateArea}
          style={{
            padding: "10px 20px",
            margin: "5px",
            fontSize: "16px",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Calculate Area 4
        </button>
      </div>

      {locationError && <p style={{ color: "red" }}>{locationError}</p>}

      <h3 style={{ marginTop: "20px" }}>Marked Coordinates (High Precision):</h3>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {coordinates.map((coord, index) => (
          <li key={index}>
            Point {index + 1}: Lat: {coord[1]}, Lng: {coord[0]}
          </li>
        ))}
      </ul>

      {area && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "green" }}>Calculated Area:</h2>
          <p>{area.meters} m²</p>
          <p>{area.feet} ft²</p>
        </div>
      )}
    </div>
  );
};

export default AreaCalculator;
