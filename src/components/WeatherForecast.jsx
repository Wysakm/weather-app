import React from 'react';
import { formatTime } from '../utils/dateUtils';
import { weatherCodeToDescription } from '../utils/weather';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { useWeatherIconFromData } from '../hooks/useWeatherIcon';

export const WeatherForecast = ({ t, i18n }) => {
  const { weatherData, loading } = useCurrentWeather();
  const { weatherIconUrl } = useWeatherIconFromData(weatherData);

  if (loading || !weatherIconUrl) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className='container-forecast'>
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

      <div className='forecast-box-II'>
        <div className='forecast-box-II-left'>
          <div>
            {t('forecast.Sunrise')} : {formatTime(weatherData?.daily?.sunrise?.[1])} {t('forecast.AM')}
          </div>
          <div>
            {t('forecast.Sunset')} : {formatTime(weatherData?.daily?.sunset?.[0])} {t('forecast.PM')}
          </div>
        </div>

        <div className='forecast-box-II-right'>
          <div>
            {t('forecast.RainChance')} : {weatherData?.daily?.precipitation_probability_max?.[0]}%
          </div>
          <div>
            {t('forecast.UVindex')} : {weatherData?.daily?.uv_index_max?.[0]}
          </div>
        </div>
      </div>
    </div>
  );
};