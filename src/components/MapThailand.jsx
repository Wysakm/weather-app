import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { provinces } from "../configs/provinces";

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
      width: 16px;
      height: 16px;
      border-radius: 50%;">
      </div>`,
    iconSize: [16, 16],
    iconAnchor: [12, 12]
  });
};

const MapThailand = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const position = provinces[0].lat && provinces[0].lon ? [provinces[0].lat, provinces[0].lon] : [13.7563, 100.5018];

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
        zoom={6}
        style={{ height: "450px", width: "100%" }}
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
                <Popup>
                  <div>
                    <h3>{location.province_name || location.province || 'Location'}</h3>
                    {location.weather_data && (
                      <div>
                        <h4>Weather Details</h4>
                        {location.weather_data.temperature_2m && <p>Temperature: {location.weather_data.temperature_2m}°C</p>}
                        {location.weather_data.apparent_temperature && <p>Apparent Temperature: {location.weather_data.apparent_temperature}°C</p>}
                        {location.weather_data.precipitation_probability_max && <p>Precipitation Probability: {location.weather_data.precipitation_probability_max}%</p>}
                      </div>
                    )}
                    {location.aqi_data && (
                      <div>
                        <h4>Air Quality</h4>
                        {location.aqi_data.aqi && <p>AQI: {location.aqi_data.aqi}</p>}
                        {location.aqi_data.level && <p>Level: {location.aqi_data.level}</p>}
                        {location.aqi_data.pm25 && <p>PM2.5: {location.aqi_data.pm25} μg/m³</p>}
                        {location.aqi_data.pm10 && <p>PM10: {location.aqi_data.pm10} μg/m³</p>}
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
