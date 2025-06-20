import { useState, useEffect } from 'react';

export const useWeatherByCoords = (latitude, longitude) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useWeatherByCoords - Received coordinates:', { latitude, longitude });
        if (!latitude || !longitude) {
            console.log('useWeatherByCoords - Missing coordinates, skipping fetch');
            return;
        }

        setLoading(true);
        const fetchWeather = async () => {
            try {
                // Construct the URL with latitude, longitude, and timezone
                let url = new URL('https://api.open-meteo.com/v1/forecast');
                url.searchParams.append('latitude', latitude);
                url.searchParams.append('longitude', longitude);
                url.searchParams.append('timezone', 'Asia/Bangkok');

                // Define weather parameters to fetch
                const params = {
                    current: [
                        'weather_code',
                        'temperature_2m',
                        'rain',
                        'precipitation',
                        'apparent_temperature',
                        'is_day'
                    ].join(','),
                    daily: [
                        'sunrise',
                        'sunset',
                        'uv_index_max',
                        'rain_sum',
                        'precipitation_probability_max',
                        'temperature_2m_min',
                        'temperature_2m_max',
                        'wind_speed_10m_max',
                        'weather_code'
                    ].join(',')
                };

                // Append each parameter to the URL
                Object.entries(params).forEach(([key, value]) => {
                    url.searchParams.append(key, value);
                });

                console.log('useWeatherByCoords - Fetching URL:', url.toString());

                // Fetch weather data from the constructed URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('useWeatherByCoords - Received data:', data);
                setWeatherData(data);
                setLoading(false);
            } catch (e) {
                console.error('useWeatherByCoords - Error:', e);
                setError(e.message);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    return { weatherData, loading, error };
};
