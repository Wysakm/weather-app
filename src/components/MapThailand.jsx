import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { provinces } from "../configs/provinces"; 


const MapThailand = () => {
  const position = provinces[0].lat && provinces[0].lon ? [provinces[0].lat, provinces[0].lon] : [13.7563, 100.5018];

  return (
    <div className="map-thailand">
    <MapContainer center={position} zoom={6} style={{ height: "450px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
    </div>
  );
};

export default MapThailand;
