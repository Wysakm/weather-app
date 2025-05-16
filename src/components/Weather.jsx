import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { provinces } from '../configs/provinces.js';
import { WeatherDisplay } from './WeatherDisplay';
import { useGeolocation } from '../hooks/useGeolocation';
import { weatherCodeToIcon } from '../utils/weatherIconMap.js';
import { loadWeatherIcon } from '../utils/iconLoader';
import './styles/Weather.css';
import { useCurrentWeather } from '../hooks/useCurrentWeather.js';
import { formatTime, getFormattedDate } from '../utils/dateUtils.js';


const initialProvince = provinces.find(p => p.names.en === 'Trang');

function Weather() {
  const { t, i18n } = useTranslation();
  const { selectedProvince, locationError } = useGeolocation(initialProvince);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);

  const { weatherData, loading } = useCurrentWeather(selectedProvince.lat, selectedProvince.lon);

  useEffect(() => {
    if (!weatherData?.current) return;

    const loadIcon = async () => {
      const iconName = weatherCodeToIcon(
        weatherData.current.weather_code,
        weatherData.current.is_day === 1
      );

      if (iconName) {
        const iconUrl = await loadWeatherIcon(iconName);
        setWeatherIcon(iconName);
        setWeatherIconUrl(iconUrl);
      }
    };

    loadIcon();
  }, [weatherData]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

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
          <div className='container-aqi'>
            <div className='aqi-box-I'>
              aaa
            </div>
            <div className='aqi-box-II'>
              sss
            </div>
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
