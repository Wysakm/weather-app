import React from 'react';
import './styles/AirQualityArticle.css';

const AirQualityArticle = () => {
  return (
    <div className="aqi-container">
      <div className='aqi-status'>
        <div className='aqi'>
          <div className='aqi-box'>
            <div className='number'>20</div>
            <div className='label'>US AQI+</div>
          </div>
          <div className='status-AQI'>
            Good
          </div>
        </div>

        <div className='main-pollutant'>
          <div className='main-pollutant-left'>
            Main Pollutant
          </div>
          <div className='main-pollutant-right'>
            <div>PM2.5 : 5 µg/m³</div>
            <div>PM10 : 10 mg/m³</div>
          </div>
        </div>

      </div>
      <div className='etc'>
        <div className='etc-left'>
          <div>NO2 : 10 µg/m³</div>
          <div>O3 : 100 µg/m³</div>
        </div>

        <div className='etc-right'>
          <div>SO2 : 1 µg/m³ </div>
          <div>CO : 0.1 µg/m³</div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityArticle;

