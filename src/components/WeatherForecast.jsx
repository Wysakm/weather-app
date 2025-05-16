import React from 'react';
import { WeatherDisplay } from './WeatherDisplay';
import { formatTime } from '../utils/dateUtils';
import { useWeatherData } from '../hooks/useWeatherData';

export const WeatherForecast = ({ latitude, longitude, t, i18n }) => {
  const { weatherData, loading, weatherIconUrl } = useWeatherData(latitude, longitude);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className='container-forecast'>
      <WeatherDisplay
        weatherData={weatherData}
        weatherIconUrl={weatherIconUrl}
        t={t}
        i18n={i18n}
      />
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