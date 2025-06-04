import React from 'react';
import './styles/WeeklyArticle.css';
import CardDailyArticle from './CardDailyArticle';
import { useWeatherByCoords } from '../hooks/useWeatherByCoords';

const WeeklyArticle = ({ latitude, longitude }) => {
  const { weatherData, loading, error } = useWeatherByCoords(latitude, longitude);

  if (loading) return <div className="weekly-article">Loading...</div>;
  if (error) return <div className="weekly-article">Error loading weather</div>;
  if (!weatherData) return <div className="weekly-article">No weather data</div>;

  const daily = weatherData.daily;
  // Get next 4 days (excluding today)
  const nextFourDays = daily.time.slice(1, 5);
  
  return (
    <div className="weekly-article">
      {nextFourDays.map((date, index) => {
        const dataIndex = index + 1; // Offset by 1 since we're skipping today
        return (
          <CardDailyArticle 
            key={index}
            date={date}
            tempMax={daily.temperature_2m_max[dataIndex]}
            tempMin={daily.temperature_2m_min[dataIndex]}
            weatherCode={daily.weather_code[dataIndex]}
            rainProb={daily.precipitation_probability_max[dataIndex]}
          />
        );
      })}
    </div>
  );
};

export default WeeklyArticle;