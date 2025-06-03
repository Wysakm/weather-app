import React from 'react';
import './styles/cardProvince.css';

// Function to get AQI color based on AQI level
const getAqiColor = (aqi) => {
  if (!aqi) return 'var(--color-good)'; // Default blue
  if (aqi <= 50) return 'var(--color-good)'; // Good - Green
  if (aqi <= 100) return 'var(--color-moderate)'; // Moderate - Yellow
  if (aqi <= 150) return 'var(--color-unhealthy-sensitive)'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return 'var(--color-unhealthy)'; // Unhealthy - Red
  if (aqi <= 300) return 'var(--color-very-unhealthy)'; // Very Unhealthy - Purple
  return 'var(--color-hazardous)'; // Hazardous - Maroon
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

const CardProvince = ({ locationData }) => {
  // Extract data from API response
  const provinceName = locationData?.province_name || 'Unknown Province';
  const temperature = locationData?.weather_data?.temperature_2m || 'N/A';
  const aqi = locationData?.aqi_data?.aqi || 'N/A';
  const pm25 = locationData?.aqi_data?.pm25 || 'N/A';
  
  // Get color and text based on AQI value
  const aqiColor = getAqiColor(aqi);
  const aqiLevel = getAqiLevel(aqi);

  return (
    <div className="card">
      <div className='card-img'>
        <img src="./image/province.webp" alt="province-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
       <div className='province-name'>{provinceName}</div>

      <div className='card-body'>
        
          
        <div className='card-container-I'>
     
          <div>Temp : {temperature}°C</div>
          <div>US AQI+ : {aqi}</div>
          <div>PM2.5 : {pm25} µg/m³</div>
        </div>
        <div className='card-container-II'>
          <div className='aqi-condition' style={{ backgroundColor: aqiColor }}>
            <div>{aqiLevel}</div>
          </div>
        </div>
      </div>
      <div className='card-info'>
        <p>Info more</p>
      </div>

    </div>


  );
};

export default CardProvince;