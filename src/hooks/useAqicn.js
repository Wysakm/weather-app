import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

const token = process.env.REACT_APP_AQI_TOKEN;

const useAqicn = () => {
    const [aqiData, setAqiData] = useState({
        aqi: null,
        pm25: null,
        pm10: null,
        no2: null,
        so2: null,
        o3: null,
        co: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { selectedProvince: province } = useGeolocation();
    console.log(' token:', token)

    useEffect(() => {
        setLoading(true);
        const fetchAqi = async () => {
            try {
                if (!token) {
                    throw new Error('AQI token is not configured');
                }
                // const url = `https://api.waqi.info/feed/${province.names.en.toLowerCase()}/?token=${token}`;
                const url = `https://api.waqi.info/feed/geo:${province.lat};${province.lon}/?token=${token}`;
                console.log('API URL:', url);
                console.log('API Token:', token);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('API Response:', data);

                if (data.status === 'ok') {
                    const iaqi = data.data.iaqi;
                    const newAqiData = {
                        aqi: data.data.aqi,
                        pm25: iaqi.pm25?.v || null,
                        pm10: iaqi.pm10?.v || null,
                        no2: iaqi.no2?.v || null,
                        so2: iaqi.so2?.v || null,
                        o3: iaqi.o3?.v || null,
                        co: iaqi.co?.v || null
                    };
                    setAqiData(newAqiData);
                    console.log('Processed AQI Data:', newAqiData);
                } else {
                    throw new Error('Failed to fetch AQI data');
                }
                setLoading(false);
            } catch (e) {
                console.error('API Error:', e);
                setError(e.message);
                setLoading(false);
            }
        };

        if (province && province.lat && province.lon) {
            fetchAqi();
        }
    }, [province]);

    return { aqiData, loading, error };
};

export { useAqicn };