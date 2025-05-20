import React from 'react';
import { useTranslation } from 'react-i18next';
import "./styles/Map.css";
import MapThailand from './MapThailand';  

function Map() {
  const { t } = useTranslation();
  
  return (
    <div className="map-container">
      <div className="header-container">
        <h2>
          {t('map.head')}
        </h2>
   
      </div>
      <div className="map-container-I">
       <MapThailand />
      </div>
      <div className="scale-container">
        <h3 className="scale-header">
          US AQI+ scale
        </h3>

        <div className="scale-bar">
          <div className="scale-I">
            AQI :
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-good)" }}>
            0-50
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-moderate)" }}>
            51-100
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-unhealthy-sensitive)" }}>
            101-150
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-unhealthy)", color: 'var(--color-navbar-bg)' }}>
            101-200
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-very-unhealthy)", color: 'var(--color-navbar-bg)' }}>
            201-300
          </div>
          <div className="scale-0" style={{ backgroundColor: "var(--color-hazardous)", color: 'var(--color-navbar-bg)' }}>
            301-500
          </div>
        </div>

        <div className="scale-bar">
          <div className="scale-II">
            Range :
          </div>

          <div className="scale-1">
            {t('aqi.Good')}
          </div>

          <div className="scale-1" >
            {t('aqi.Moderate')}
          </div>
          <div className="scale-1" >
            {t('aqi.UnhealthyForSensitiveGroups')}
          </div>
          <div className="scale-1">
            {t('aqi.Unhealthy')}
          </div>
          <div className="scale-1" >
            {t('aqi.VeryUnhealthy')}
          </div>
          <div className="scale-1" >
            {t('aqi.Hazardous')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;