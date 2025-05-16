import { useState, useEffect } from 'react';
import { useCurrentWeather } from './useCurrentWeather';
import { weatherCodeToIcon } from '../utils/weatherIconMap';
import { loadWeatherIcon } from '../utils/iconLoader';

export const useWeatherData = (latitude, longitude) => {
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);
  const { weatherData, loading } = useCurrentWeather(latitude, longitude);

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

  return {
    weatherData,
    loading,
    weatherIcon,
    weatherIconUrl
  };
};