import React, { useState, useEffect } from 'react';
import './styles/Weekly.css';
import CardDaily from './cardDaily';

const Weekly = ({ latitude, longitude, t, i18n }) => {
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyForecast = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        // แปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ต้องการ
        const formattedData = data.daily.time.map((date, index) => ({
          id: index + 1,
          date: date,
          weatherCode: data.daily.weathercode[index],
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          precipitation: data.daily.precipitation_probability_max[index]
        }));

        setWeeklyForecast(formattedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeeklyForecast();
    }
  }, [latitude, longitude]);

  if (!i18n) return <div>Loading...</div>;
  if (isLoading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-weekly">
      {weeklyForecast.map((day) => (
        <CardDaily
          key={day.id}
          date={day.date}
          weatherCode={day.weatherCode}
          maxTemp={day.maxTemp}
          minTemp={day.minTemp}
          precipitation={day.precipitation}
          language={i18n.language}
        />
      ))}
    </div>
  );
};

export default Weekly;
