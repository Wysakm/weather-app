import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Function to get marker color based on AQI level
const getMarkerColor = (aqi) => {
  if (!aqi) return 'var(--color-good)'; // Default blue
  if (aqi <= 50) return 'var(--color-good)'; // Good - Green
  if (aqi <= 100) return 'var(--color-moderate)'; // Moderate - Yellow
  if (aqi <= 150) return 'var(--color-unhealthy-sensitive)'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return 'var(--color-unhealthy)'; // Unhealthy - Red
  if (aqi <= 300) return 'var(--color-very-unhealthy)'; // Very Unhealthy - Purple
  return 'var(--color-hazardous)'; // Hazardous - Maroon
};

// Function to create custom colored marker
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;">
      </div>`,
    iconSize: [12, 12],
    iconAnchor: [12, 12]
  });
};

const MapThailand = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Center of Thailand coordinates - Phra Nakhon Si Ayutthaya
  const position = [14.3692, 100.5877];

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/weather/rankings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = (await response.json()).data;
          console.log(' data:', data)
          setWeatherData(data);
        } else {
          console.error('Failed to fetch weather data');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // Thailand bounds to restrict map view
  const thailandBounds = [
    [5.6, 97.3], // Southwest coordinates
    [20.5, 105.6] // Northeast coordinates
  ];

  return (
    <div className="map-thailand">
      <MapContainer
        center={position}
        zoom={5.3}
        style={{ height: "500px", width: "100%" }}
        bounds={thailandBounds}
        maxBounds={thailandBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
        maxZoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!loading && weatherData.rankings.map((location, index) => {
          const aqiValue = location.aqi_data?.aqi;
          const markerColor = getMarkerColor(aqiValue);
          const customIcon = createCustomIcon(markerColor);

          return (
            location.latitude && location.longitude && (
              <Marker
                key={index}
                position={[location.latitude, location.longitude]}
                icon={customIcon}
              >
                <Popup
                  maxWidth={200}
                  minWidth={150}
                  className="custom-popup"
                  keepInView={false}
                  autoPan={false}
                >
                  <div style={{ padding: '2px', lineHeight: '1' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {location.province_name || location.province || 'Location'}
                    </h3>
                    {location.aqi_data && (
                      <div>
                        {location.aqi_data.aqi && <p style={{ margin: '2px 0', fontSize: '11px' }}>AQI: {location.aqi_data.aqi}</p>}
                        {location.aqi_data.level && <p style={{ margin: '2px 0', fontSize: '11px' }}>Level: {location.aqi_data.level}</p>}
                        {location.aqi_data.pm25 && <p style={{ margin: '2px 0', fontSize: '11px' }}>PM2.5: {location.aqi_data.pm25} μg/m³</p>}
                        {location.aqi_data.pm10 && <p style={{ margin: '2px 0', fontSize: '11px' }}>PM10: {location.aqi_data.pm10} μg/m³</p>}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapThailand;
