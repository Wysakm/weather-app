import React from 'react';
import './styles/AirQuality.css';
import { useAqicn } from '../hooks/useAqicn';

export const AirQuality = ({ t }) => {
  const { aqiData, loading, error } = useAqicn();

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return 'var(--color-good)';        // Good
    if (aqi <= 100) return 'var(--color-moderate)';   // Moderate
    if (aqi <= 150) return 'var(--color-unhealthy-sensitive)';  // Unhealthy for Sensitive Groups
    if (aqi <= 200) return 'var(--color-unhealthy)';  // Unhealthy
    if (aqi <= 300) return 'var(--color-very-unhealthy)';  // Very Unhealthy
    return 'var(--color-hazardous)';                  // Hazardous
  };

  const getAqiStatus = (aqi) => {
    if (aqi <= 50) return 'aqi.Good';
    if (aqi <= 100) return 'aqi.Moderate';
    if (aqi <= 150) return 'aqi.UnhealthyForSensitiveGroups';
    if (aqi <= 200) return 'aqi.Unhealthy';
    if (aqi <= 300) return 'aqi.VeryUnhealthy';
    return 'aqi.Hazardous';
  };

  const getAqiClassName = (aqi) => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!aqiData || !aqiData.aqi) return <div>No data available</div>;

  return (
    <div className='container-aqi'>
      <div className={`aqi-box-I ${getAqiClassName(aqiData.aqi)}`}>
        <div className='aqi-score' style={{ backgroundColor: getAqiColor(aqiData.aqi) }}>
          <div className='aqi-number'>{aqiData.aqi}</div>
          <div className='aqi-label'>US AQI+</div>
        </div>
        <div className='aqi-status'>
          {t(getAqiStatus(aqiData.aqi))}
        </div>
      </div>
      <div className={`aqi-box-III ${getAqiClassName(aqiData.aqi)}`}>
        <div className='pollutant-main'>
          <div className='pollutant-label'>{t('pollutant.MainPollutant')}</div>
          <div className='pollutant-data'>
            <div>PM2.5 : <span>{aqiData.pm25} µg/m³</span></div>
            <div>PM10 : <span>{aqiData.pm10} mg/m³</span></div>
          </div>
        </div>
      </div>

      <div className='aqi-box-II'>
        <div className='pollutant-secondary'>
          <div className='pollutant-secondary-left'>
            <div>NO2 : {aqiData.no2} µg/m³</div>
            <div>O3 : {aqiData.o3} mg/m³</div>
          </div>
          <div className='pollutant-secondary-right'>
            <div>SO2 : {aqiData.so2} µg/m³</div>
            <div>CO : {aqiData.co} µg/m³</div>
          </div>
        </div>
      </div>
    </div>
  );
};