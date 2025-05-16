import { useState, useEffect } from 'react';

const useCurrentWeather = (latitude, longitude) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.append('latitude', latitude);
        url.searchParams.append('longitude', longitude);
        url.searchParams.append('timezone', 'Asia/Bangkok');
        
        // Current weather parameters
        url.searchParams.append('current', [
          'weather_code',
          'temperature_2m',
          'rain',
          'precipitation',
          'apparent_temperature'
        ].join(','));
        
        // Daily forecast parameters
        url.searchParams.append('daily', [
          'sunrise',
          'sunset',
          'uv_index_max',
          'rain_sum',
          'precipitation_probability_max',
          'temperature_2m_min',
          'temperature_2m_max',
          'wind_speed_10m_max'
        ].join(','));

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return { weatherData, loading, error };
};

export default useCurrentWeather;