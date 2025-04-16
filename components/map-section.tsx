"use client"

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Earthquake = {
  id: string;
  place: string;
  magnitude: number;
  time: number;
  coords: [number, number];
};

const MapSection = () => {
  const [quakes, setQuakes] = useState<Earthquake[]>([]);

  useEffect(() => {
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson")
      .then(res => res.json())
      .then(data => {
        const features = data.features.map((f: any) => ({
          id: f.id,
          place: f.properties.place,
          magnitude: f.properties.mag,
          time: f.properties.time,
          coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
        }));
        setQuakes(features);
      });
  }, []);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {quakes.map(eq => (
          <Marker key={eq.id} position={eq.coords}>
            <Popup>
              <strong>{eq.place}</strong><br />
              Magnitude: {eq.magnitude}<br />
              {new Date(eq.time).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapSection;
