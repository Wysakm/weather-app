import React from 'react';
import { weatherCodeToDescription } from '../utils/weatherIconMap';

export const WeatherDisplay = ({ weatherData, weatherIconUrl, t, i18n }) => {
  return (
    <div className='forecast-box-I'>
      <div className='temp-box'>
        <div className='icon-weather'>
          {weatherIconUrl && (
            <img
              src={weatherIconUrl}
              alt={weatherCodeToDescription(weatherData.current.weather_code, i18n.language)}
              className="weather-icon"
            />
          )}
        </div>
        <div className='temp'>
          {weatherData?.current?.temperature_2m}°C
        </div>
      </div>

      <div className='weather-condition'>
        {weatherData?.current && weatherCodeToDescription(weatherData.current.weather_code, i18n.language)}
      </div>

      <div className='temp-HL'>
        <div>{t('forecast.High')} : {weatherData?.daily?.temperature_2m_max?.[0]} °C</div>
        <div>{t('forecast.Low')} : {weatherData?.daily?.temperature_2m_min?.[0]} °C</div>
      </div>
      <div className='feels-like'>
        {t('forecast.FeelsLike')} : {weatherData?.current?.apparent_temperature} °C
      </div>
    </div>
  );
};