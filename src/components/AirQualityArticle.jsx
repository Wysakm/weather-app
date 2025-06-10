import React from 'react';
import './styles/AirQualityArticle.css';
import { useAqiByCoords } from '../hooks/useAqiByCoords';

// Function to get AQI color based on AQI value
const getAqiColor = (aqi) => {
  if (!aqi) return 'var(--color-good)'; // Default
  if (aqi <= 50) return 'var(--color-good)'; // Good - Green
  if (aqi <= 100) return 'var(--color-moderate)'; // Moderate - Yellow
  if (aqi <= 150) return 'var(--color-unhealthy-sensitive)'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return 'var(--color-unhealthy)'; // Unhealthy - Red
  if (aqi <= 300) return 'var(--color-very-unhealthy)'; // Very Unhealthy - Purple
  return 'var(--color-hazardous)'; // Hazardous - Maroon
};

// Function to get AQI background color based on AQI value
const getAqiBackgroundColor = (aqi) => {
  if (!aqi) return 'var(--color-good-bg)'; // Default
  if (aqi <= 50) return 'var(--color-good-bg)'; // Good - Light Green
  if (aqi <= 100) return 'var(--color-moderate-bg)'; // Moderate - Light Yellow
  if (aqi <= 150) return 'var(--color-unhealthy-sensitive-bg)'; // Unhealthy for Sensitive - Light Orange
  if (aqi <= 200) return 'var(--color-unhealthy-bg)'; // Unhealthy - Light Red
  if (aqi <= 300) return 'var(--color-very-unhealthy-bg)'; // Very Unhealthy - Light Purple
  return 'var(--color-hazardous-bg)'; // Hazardous - Light Maroon
};

// Function to get AQI level text based on AQI value
const getAqiLevel = (aqi) => {
  if (!aqi || aqi === 'N/A') return 'Unknown';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const AirQualityArticle = ({ latitude, longitude }) => {
  const { aqiData, loading, error } = useAqiByCoords(latitude, longitude);

  if (loading) return <div className="aqi-container">Loading AQI...</div>;
  if (error) return <div className="aqi-container">Error loading AQI</div>;
  if (!aqiData.aqi) return <div className="aqi-container">No AQI data</div>;

  const aqiColor = getAqiColor(aqiData.aqi);
  const aqiBackgroundColor = getAqiBackgroundColor(aqiData.aqi);
  const aqiLevel = getAqiLevel(aqiData.aqi);

  return (
    <div className="aqi-container" style={{ backgroundColor: `${aqiColor}20` }}>
      <div className='aqi-status-article'>
        <div
          className='aqi'
          style={{ backgroundColor: aqiBackgroundColor }}
        >
          <div
            className='aqi-box'
            style={{
              backgroundColor: aqiColor,
              color: 'var(--color-text)'
            }}
          >
            <div className='number'>{aqiData.aqi}</div>
            <div className='label'>US AQI+</div>
          </div>
          <div className='status-AQI'>
            {aqiLevel}
          </div>
        </div>

        <div
          className='main-pollutant'
          style={{ backgroundColor: aqiBackgroundColor }}
        >
          <div className='main-pollutant-left'>
            Main Pollutant
          </div>
          <div className='main-pollutant-right'>
            <div>PM2.5: {aqiData.pm25 || 'N/A'} µg/m³</div>
            <div>PM10: {aqiData.pm10 || 'N/A'} µg/m³</div>
          </div>
        </div>
      </div>

      <div className='etc'>
        <div className='etc-left'>
          <div>NO2: {aqiData.no2 || 'N/A'} µg/m³</div>
          <div>O3: {aqiData.o3 || 'N/A'} µg/m³</div>
        </div>

        <div className='etc-right'>
          <div>SO2: {aqiData.so2 || 'N/A'} µg/m³</div>
          <div>CO: {aqiData.co || 'N/A'} µg/m³</div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityArticle;

