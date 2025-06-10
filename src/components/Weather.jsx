import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLocationStore } from '../stores/useLocationStore.js';
import { provinces } from '../configs/provinces.js';
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
  const location = useLocation();
  const { selectedProvince, loading: locationLoading, setLocation } = useLocationStore();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setLocation(option?.province)
  }, [option?.province, setLocation])

  // Handle province selection from TabProvinces
  const handleProvinceSelect = useCallback((provinceFromApi) => {
    console.log('Selected province from tab:', provinceFromApi);
    
    // Find matching province from the provinces config based on province name
    const matchingProvince = provinces.find(p => 
      p.names.en.toLowerCase() === provinceFromApi.province_name?.toLowerCase() ||
      p.names.th === provinceFromApi.province_name
    );
    
    if (matchingProvince) {
      setLocation({ province: matchingProvince });
    } else {
      console.warn('No matching province found for:', provinceFromApi.province_name);
    }
  }, [setLocation]);

  if (locationLoading || !selectedProvince) return <div className="loading-spinner">Loading...</div>;
  // console.log(' selectedProvince:', selectedProvince, locationLoading)

  return (
    <>
      {!isHomePage && (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <h1 style={{ margin: '2rem', width: '100%', textAlign: 'center',gap:'16px' }}>{t('CampStay.CampStayHeader')}</h1>
        </div>
      )}
      {!isHomePage && (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <TabProvinces onProvinceSelect={handleProvinceSelect} />
        </div>
      )}
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
              key={`weather-${selectedProvince?.lat}-${selectedProvince?.lon}`}
              latitude={selectedProvince.lat}
              longitude={selectedProvince.lon}
              t={t}
              i18n={i18n}
            />
            <AirQuality 
              key={`aqi-${selectedProvince?.lat}-${selectedProvince?.lon}`}
              t={t} 
              aqiData={mockAqiData} 
            />
          </div>
          <div className='container-weeklyForecast'>
            <Weekly
              key={`weekly-${selectedProvince?.lat}-${selectedProvince?.lon}`}
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
