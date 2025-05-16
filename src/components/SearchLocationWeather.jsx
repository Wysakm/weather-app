import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import bgImage from '../assets/image/bg-search.webp';
import './styles/SearchLocationWeather.css';

function SearchLocationWeather() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("location"); // ค่าเริ่มต้นเป็น "location"

  return (
    <div className='search-container-I'
      style={{ backgroundImage: `url(${bgImage})` }} >
      <div className='searchBox-I'>
        <div className='searchText-I'>
          <h1>{t('search.Discover')}</h1>
        </div>
        <div className='searchText-II'>
          <h1>{t('search.based')}</h1>
        </div>

        <div className="tab-container">
          <div
            className={`tab ${activeTab === "location" ? "active" : ""}`}
            onClick={() => setActiveTab("location")}
            data-tab="location"
          >
            {t('search.Search by Location')}
          </div>
          <div
            className={`tab ${activeTab === "weather" ? "active" : ""}`}
            onClick={() => setActiveTab("weather")}
            data-tab="weather"
          >
            {t('search.Search by Weather')}
          </div>
        </div>



        <div className={`search-button ${activeTab === 'location' ? 'location-active' : 'weather-active'}`}>

          {activeTab === "location" ? (
            <div className='search-button-I'>
              <p>{t('search.location')}</p>
              <input className='search-input' type="text" placeholder={t('search.searchText')} />
            </div>
          ) : (

            <div className='search-button-III'>
              <div className='search-button-III-A'>
                <p>{t('search.WeatherCondition')}</p>
                <select className="select-WeatherCondition">
                  <option value="0">☀️ {t('weather.ClearSky')}</option>
                  <option value="1">🌤️ {t('weather.MainlyClearSky')}</option>
                  <option value="2">⛅ {t('weather.PartlyCloudy')}</option>
                  <option value="3">☁️ {t('weather.Cloudy')}</option>
                  <option value="51">🌦️ {t('weather.LightDrizzle')}</option>
                  <option value="61">🌧️ {t('weather.ModerateShowerRain')}</option>
                </select>
              </div>

              <div className='search-button-III-A'>
                <p>{t('search.AQL')}</p>
                <select className="select-WeatherCondition">
                  <option value="0-50">🟢 {t('aqi.Good')}</option>
                  <option value="51-100">🟡 {t('aqi.Moderate')}</option>
                  <option value="101-150">🟠 {t('aqi.UnhealthyForSensitiveGroups')}</option>

                </select>
              </div>

            </div>
          )}


          <div className='search-button-II'>
            <button className='search'>{t('search.search')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchLocationWeather; 