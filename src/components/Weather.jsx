import React from 'react';
import { useTranslation } from 'react-i18next';
import { provinces } from '../configs/provinces.js';
import { useGeolocation } from '../hooks/useGeolocation';
import './styles/Weather.css';
import { getFormattedDate } from '../utils/dateUtils.js';
import { WeatherForecast } from './WeatherForecast.jsx';

const initialProvince = provinces.find(p => p.names.en === 'Trang');

function Weather() {
  const { t, i18n } = useTranslation();
  const { selectedProvince, locationError } = useGeolocation(initialProvince);

  return (
    <div className='weather-container'>
      <div className='container'>
        <div className='container-lacationDate'>
          <div className='container-blank'>
            {t('aqi.Good')}
          </div>

          <div className='container-location'>
            <h2>
              {selectedProvince.names[i18n.language === 'th' ? 'th' : 'en']}
            </h2>
            {locationError && (
              <p className="location-error">{locationError}</p>
            )}
          </div>
          <div className='container-date'>{getFormattedDate(i18n.language)}</div>
        </div>

        <div className='container-forecastAql'>
          {/* <div className='container-forecast'> */}
            <WeatherForecast
              latitude={selectedProvince.lat}
              longitude={selectedProvince.lon}
              t={t}
              i18n={i18n}
            />
          {/* </div> */}
          <div className='container-aqi'>
            <div className='aqi-box-I'>aaa</div>
            <div className='aqi-box-II'>sss</div>
          </div>
        </div>
        <div className='container-weeklyForecast'>
          พยากรณ์อากาศรายสัปดาห์ (Weekly): dddd
        </div>
      </div>
    </div>
  );
}

export default Weather;
