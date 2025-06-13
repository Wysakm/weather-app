import React from 'react';
import './styles/cardDailyArticle.css';
import { useWeatherIcon } from '../hooks/useWeatherIcon';

const CardDailyArticle = ({ date, tempMax, tempMin, weatherCode, rainProb }) => {
  const { weatherIconUrl } = useWeatherIcon({
    weatherCode: weatherCode,
    isDay: 1
  });

  // Format date to show day/month
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="cardDaily-article">
      <div className='daily'>
        {formatDate(date)}
      </div>

      <div className='temperature-max-min'>
        <div className='maximum'>
          H:{Math.round(tempMax)}°C /
        </div>
        <div className='minimum'>
          L:{Math.round(tempMin)}°C
        </div>
      </div>

      <div className='icon-daily'> 
        {weatherIconUrl ? (
          <img src={weatherIconUrl} alt="weather" style={{ width: '30px', height: '30px' }} />
        ) : (
          '🌤️'
        )}
      </div>
      
      <div className='rain'>
        Rain: {rainProb || 0}% 
      </div>
    </div>
  );
};

export default CardDailyArticle;