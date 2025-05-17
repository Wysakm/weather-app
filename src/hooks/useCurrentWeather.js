import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

export const useCurrentWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {selectedProvince: province} = useGeolocation();

    useEffect(() => {
        setLoading(true);
        const fetchWeather = async () => {
            try {
                // Construct the URL with latitude, longitude, and timezone
                let url = new URL('https://api.open-meteo.com/v1/forecast');
                url.searchParams.append('latitude', province.lat);
                url.searchParams.append('longitude', province.lon);
                url.searchParams.append('timezone', 'Asia/Bangkok');

                // Define weather parameters to fetch
                const params = {
                    current: [
                        'weather_code',
                        'temperature_2m',
                        'rain',
                        'precipitation',
                        'apparent_temperature'
                    ].join(','),
                    daily: [
                        'sunrise',
                        'sunset',
                        'uv_index_max',
                        'rain_sum',
                        'precipitation_probability_max',
                        'temperature_2m_min',
                        'temperature_2m_max',
                        'wind_speed_10m_max'
                    ].join(',')
                };

                // Append each parameter to the URL
                Object.entries(params).forEach(([key, value]) => {
                    url.searchParams.append(key, value);
                });

                // Fetch weather data from the constructed URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: \${response.status}`);
                }

                const data = await response.json();
                setWeatherData(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        if (province) {
            fetchWeather();
        }
    }, [province]);

    return { weatherData, loading, error };
};