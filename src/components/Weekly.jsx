import React, { useState, useEffect } from 'react';
import './styles/Weekly.css';
import CardDaily from './CardDaily';

const Weekly = ({ latitude, longitude, t, i18n }) => {
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const formattedData = data.daily.time
          .slice(1, 8) // เริ่มจากวันพรุ่งนี้ (index 1) ถึงอีก 7 วัน
          .map((date, index) => ({
            id: index + 1,
            date: date,
            weatherCode: data.daily.weathercode[index + 1],
            maxTemp: Math.round(data.daily.temperature_2m_max[index + 1]),
            minTemp: Math.round(data.daily.temperature_2m_min[index + 1]),
            precipitation: data.daily.precipitation_probability_max[index + 1]
          }));
        console.log(' formattedData:', formattedData)

        setWeeklyForecast(formattedData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeeklyForecast();
    }
  }, [latitude, longitude]);

  if (!i18n || isLoading) return <div>Loading...</div>

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
