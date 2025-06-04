import { useState, useEffect } from 'react';

const token = process.env.REACT_APP_AQI_TOKEN;

const convertAqiToPm25 = (aqi) => {
    const breakpoints = [
        { aqiLow: 0, aqiHigh: 50, pmLow: 0.0, pmHigh: 12.0 },
        { aqiLow: 51, aqiHigh: 100, pmLow: 12.1, pmHigh: 35.4 },
        { aqiLow: 101, aqiHigh: 150, pmLow: 35.5, pmHigh: 55.4 },
        { aqiLow: 151, aqiHigh: 200, pmLow: 55.5, pmHigh: 150.4 },
        { aqiLow: 201, aqiHigh: 300, pmLow: 150.5, pmHigh: 250.4 },
        { aqiLow: 301, aqiHigh: 400, pmLow: 250.5, pmHigh: 350.4 },
        { aqiLow: 401, aqiHigh: 500, pmLow: 350.5, pmHigh: 500.4 }
    ];

    const range = breakpoints.find(bp => aqi >= bp.aqiLow && aqi <= bp.aqiHigh);
    if (!range) return null;

    const { aqiLow, aqiHigh, pmLow, pmHigh } = range;
    const pm25 = ((aqi - aqiLow) / (aqiHigh - aqiLow)) * (pmHigh - pmLow) + pmLow;
    return parseFloat(pm25.toFixed(1));
};

const getAqiStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

export const useAqiByCoords = (latitude, longitude) => {
    const [aqiData, setAqiData] = useState({
        aqi: null,
        status: null,
        pm25: null,
        pm10: null,
        no2: null,
        so2: null,
        o3: null,
        co: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        setLoading(true);
        const fetchAqi = async () => {
            try {
                if (!token) {
                    throw new Error('AQI token is not configured');
                }
                
                const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${token}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'ok') {
                    const iaqi = data.data.iaqi;
                    const aqi = data.data.aqi;
                    const convertedPm25 = convertAqiToPm25(aqi);

                    const newAqiData = {
                        aqi: aqi,
                        status: getAqiStatus(aqi),
                        pm25: convertedPm25,
                        pm10: iaqi.pm10?.v || null,
                        no2: iaqi.no2?.v || null,
                        so2: iaqi.so2?.v || null,
                        o3: iaqi.o3?.v || null,
                        co: iaqi.co?.v || null
                    };
                    setAqiData(newAqiData);
                } else {
                    throw new Error('Failed to fetch AQI data');
                }
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchAqi();
    }, [latitude, longitude]);

    return { aqiData, loading, error };
};
