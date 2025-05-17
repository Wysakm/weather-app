import { useState, useEffect } from 'react';
import { useCurrentWeather } from './useCurrentWeather';
import { weatherCodeToIcon } from '../utils/weather';
import { loadWeatherIcon } from '../utils/iconLoader';

export const useWeatherData = (weatherData) => {
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);
  const { weatherData: _weatherData } = useCurrentWeather();

  useEffect(() => {
    if (!weatherData?.current) return;

    const loadIcon = async (_wd) => {
      const iconName = weatherCodeToIcon(
        _wd.current.weather_code,
        _wd.current.is_day === 1
      );

      if (iconName) {
        const iconUrl = await loadWeatherIcon(iconName);
        setWeatherIcon(iconName);
        setWeatherIconUrl(iconUrl);
      }
    };
    const wd = weatherData || _weatherData;
    loadIcon(wd);
  }, [_weatherData, weatherData]);

  return {
    // weatherData,
    // loading,
    weatherIcon,
    weatherIconUrl
  };
};