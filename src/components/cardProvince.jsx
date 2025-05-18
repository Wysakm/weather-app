import React from 'react';
import './styles/cardProvince.css';

const CardProvince = () => {

  return (
    <div className="card">
      <div className='card-img'>

      </div>

      <div className='card-body'>
        <div className='card-container' style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}>
          <h2>Province</h2>
          <div>Temp : 28°C</div>
          <div>US AQI+ : </div>
          <div>PM2.5 : 10 µg/m³ </div>
        </div>
      </div>
      <div className='card-info'>
        <p>Info more</p>
      </div>

    </div>


  );
};

export default CardProvince;