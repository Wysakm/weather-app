import React from "react";
import './styles/WeatherArticle.css'
import { useWeatherByCoords } from '../hooks/useWeatherByCoords';
import { useWeatherIcon } from '../hooks/useWeatherIcon';
import { getFormattedDate, formatTime } from '../utils/dateUtils';
import { weatherCodeToDescription } from '../utils/weather';

const WeatherArticle = ({ latitude, longitude, provinceName }) => {
  const { weatherData, loading, error } = useWeatherByCoords(latitude, longitude);
  const { weatherIconUrl } = useWeatherIcon({
    weatherCode: weatherData?.current?.weather_code,
    isDay: weatherData?.current?.is_day
  });

  if (loading) return <div className="weatherArticle-container">Loading weather...</div>;
  if (error) return <div className="weatherArticle-container">Error loading weather</div>;
  if (!weatherData) return <div className="weatherArticle-container">No weather data</div>;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const todayFormatted = getFormattedDate('en');

  return (
    <div className="weatherArticle-container">
      <div className="DMY-province">
        <div className="date">
          {todayFormatted}
        </div>
        <div className="province">
          {provinceName || 'Loading...'}
        </div>
      </div>

      <div className="temp-condition">
        <div className="image-condition">
          {weatherIconUrl ? (
            <img src={weatherIconUrl} alt="weather" style={{ width: '50px', height: '50px' }} />
          ) : (
            '🌤️'
          )}
        </div>
        <div className="temperature">{Math.round(current.temperature_2m)}°C</div>
      </div>


   
       
        <div className="condition">
          {weatherCodeToDescription(current.weather_code, 'en')}
        </div>

       <div className="HL-box">
          H: {Math.round(daily.temperature_2m_max[0])}°C / L: {Math.round(daily.temperature_2m_min[0])}°C 
          </div>

            <div className="feelsLike-box">
          Feels like: {Math.round(current.apparent_temperature)}°C 
        </div>

      <div className="etc-forecast">
        <div className="etc-left">
          <div>
            Sun rise: {formatTime(daily.sunrise[0], 'th')}
          </div>
          <div>
            Sun set: {formatTime(daily.sunset[0], 'th')} 
          </div>
        </div>

        <div className="etc-right">
          <div>
            Rain: {daily.precipitation_probability_max[0] || 0}%
          </div>
          <div>
            UV Index: {Math.round(daily.uv_index_max[0]) || 0} 
          </div>
        </div>
      </div>

    </div>

  );
};

export default WeatherArticle;

//