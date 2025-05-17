import React from 'react';
import './styles/cardDaily.css';

const CardDaily = ({ date, weatherCode, maxTemp, minTemp, precipitation, language }) => {
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

  // ฟังก์ชันสำหรับเลือกไอคอนตาม weatherCode
  const getWeatherIcon = (code) => {
    // ตัวอย่างการเลือกไอคอน (ควรปรับตามระบบไอคอนที่ใช้จริง)
    switch (code) {
      case 0:
        return '☀️';
      case 1:
        return '🌤️';
      case 3:
        return '☁️';
      case 45:
        return '🌫️';
      case 80:
        return '🌧️';
      case 95:
        return '⛈️';
      default:
        return '❓';
    }
  };

  return (
    <div className="card-daily">
      <div className="day">{formatDate()}</div>
      <div className="temp-max-min">
        <span className="max">H:{maxTemp}°C / </span>
        <span className="min">L:{minTemp}°C</span>
      </div>
      <div className="icon">{getWeatherIcon(weatherCode)}</div>
      <div className="rain">Rain : {precipitation}%</div>
    </div>
  );
};

export default CardDaily;
