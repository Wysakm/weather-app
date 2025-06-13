import { useState, useEffect } from 'react';
import { weatherCodeToIcon } from '../utils/weather';
import { loadWeatherIcon } from '../utils/iconLoader';

export const useWeatherIcon = ({ weatherCode, isDay = 1 }) => {
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIcon = async () => {
      if (!weatherCode) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const iconName = weatherCodeToIcon(weatherCode, isDay);

        if (iconName) {
          const iconUrl = await loadWeatherIcon(iconName);
          setWeatherIcon(iconName);
          setWeatherIconUrl(iconUrl);
        }
      } catch (error) {
        console.error('Error loading weather icon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [weatherCode, isDay]);

  return {
    weatherIcon,
    weatherIconUrl,
    loading
  };
};

// Alternative usage with weatherData object
export const useWeatherIconFromData = (weatherData) => {
  return useWeatherIcon({
    weatherCode: weatherData?.current?.weather_code,
    isDay: weatherData?.current?.is_day
  });
};