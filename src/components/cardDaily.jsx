import React, { useEffect } from 'react';
import './styles/cardDaily.css';
import { weatherCodeToDescription } from '../utils/weather';
import { useWeatherIcon } from '../hooks/useWeatherIcon';

const CardDaily = ({ date, weatherCode, maxTemp, minTemp, precipitation, language }) => {
  const { weatherIconUrl } = useWeatherIcon({ weatherCode , isDay: 1 });
  

  const dateObj = new Date(date);
  const today = new Date('2025-05-17');
  
  const isToday = dateObj.toDateString() === today.toDateString();
  
  const formatDate = () => {
    if (isToday) {
      return language === 'th' ? 'วันนี้' : 'Today';
    }
    
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    return `${day}/${month}`;
  };

  return (
    <div className="card-daily">
      <div className="day">{formatDate()}</div>
      <div className="temp-max-min">
        <span className="max">H:{maxTemp}°C / </span>
        <span className="min">L:{minTemp}°C</span>
      </div>
      <div className="icon">
        {weatherCode ? (
          <img
            src={weatherIconUrl}
            alt={weatherCodeToDescription(weatherCode, language)}
            className="weather-icon"
          />
        ) : (
          <div>No weather data</div>
        )}
      </div>
      <div className="rain">Rain : {precipitation}%</div>
    </div>
  );
};

export default CardDaily;
