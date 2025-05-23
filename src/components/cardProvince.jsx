import React from 'react';
import './styles/cardProvince.css';

const CardProvince = () => {

  return (
    <div className="card">
      <div className='card-img'>

      </div>

      <div className='card-body'>
        <div className='card-container-I'>
          <h3>Province</h3>
          <div>Temp : 28°C</div>
          <div>US AQI+ : 50 mg/m³ </div>
          <div>PM2.5 : 10 µg/m³ </div>
        </div>
        <div className='card-container-II'>
          <div className='aqi-condition'>
          Good
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