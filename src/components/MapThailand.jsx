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

  return (
    <div className="map-thailand">
      <MapContainer center={position} zoom={6} style={{ height: "450px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!loading && weatherData.rankings.map((location, index) => (
          location.latitude && location.longitude && (
            <Marker key={index} position={[location.latitude, location.longitude]}>
              <Popup>
                <div>
                  <h3>{location.province_name || location.province || 'Location'}</h3>
                  {location.temperature && <p>Temperature: {location.temperature}°C</p>}
                  {location.humidity && <p>Humidity: {location.humidity}%</p>}
                  {location.weather && <p>Weather: {location.weather}</p>}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapThailand;
