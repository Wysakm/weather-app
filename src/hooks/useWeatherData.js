import { useState, useEffect } from 'react';
import { useCurrentWeather } from './useCurrentWeather';
import { weatherCodeToIcon } from '../utils/weather';
import { loadWeatherIcon } from '../utils/iconLoader';

export const useWeatherData = () => {
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);
  const { weatherData } = useCurrentWeather();

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
  }, []);

  return {
    // weatherData,
    // loading,
    weatherIcon,
    weatherIconUrl
  };
};