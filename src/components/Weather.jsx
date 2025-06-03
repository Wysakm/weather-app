import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocationStore } from '../stores/useLocationStore.js';
import './styles/Weather.css';
import { getFormattedDate } from '../utils/dateUtils.js';
import { WeatherForecast } from './WeatherForecast.jsx';
import { AirQuality } from './AirQuality';
import Weekly from './Weekly.jsx';  // เปลี่ยนจาก { Weekly }
import TabProvinces from './TabProvinces.jsx';

const mockAqiData = {
  aqi: 24,
  pm25: 5,
  pm10: 49,
  no2: 0.4,
  so2: 0.4,
  o3: 0.1,
  co: 0.4
};

function Weather({ option }) {
  console.log(' option:', option)
  const { t, i18n } = useTranslation();
  const { selectedProvince, loading: locationLoading, setLocation } = useLocationStore();

  useEffect(() => {
    setLocation(option?.province)
  }, [option?.province, setLocation])

  if (locationLoading || !selectedProvince) return <div className="loading-spinner">Loading...</div>;
  // console.log(' selectedProvince:', selectedProvince, locationLoading)

  return (
    <>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <h1 style={{ margin: '2rem' }}>{t('CampStay.CampHeader')}</h1>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TabProvinces />
      </div>
      <div className='weather-container'>
        <div className='container'>
          <div className='container-lacationDate'>
            <div className='container-blank'></div>

            <div className='container-location'>
              <h1>
                {selectedProvince.names[i18n.language === 'th' ? 'th' : 'en']}
              </h1>
            </div>
            <div className='container-date'>{getFormattedDate(i18n.language)}</div>
          </div>

          <div className='container-forecastAql'>
            <WeatherForecast
              // latitude={selectedProvince.lat}
              // longitude={selectedProvince.lon}
              t={t}
              i18n={i18n}
            />
            <AirQuality t={t} aqiData={mockAqiData} />
          </div>
          <div className='container-weeklyForecast'>
            <Weekly
              latitude={selectedProvince.lat}
              longitude={selectedProvince.lon}
              t={t}
              i18n={i18n}
            />
          </div>
        </div>
      </div>
    </>

  );
}

export default Weather;
