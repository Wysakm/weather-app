import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import searchAPI from '../api/search';
import bgImage from '../assets/image/bg-search.webp';
import './styles/SearchLocationWeather.css';

function SearchLocationWeather() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("location");
  
  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [aqiRange, setAqiRange] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Handle location search input with autocomplete
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for suggestions
    if (value.trim().length > 2) {
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await searchAPI.getSuggestions(value, 'places');
          setSuggestions(response.data?.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = async () => {
    if (activeTab === "location" && !searchQuery.trim()) {
      alert(t('search.pleaseEnterLocation'));
      return;
    }

    if (activeTab === "weather" && !weatherCondition && !aqiRange) {
      alert(t('search.pleaseSelectWeatherCondition'));
      return;
    }

    setIsLoading(true);

    try {
      let searchResults;
      
      if (activeTab === "location") {
        // Location search
        searchResults = await searchAPI.searchLocations(searchQuery);
      } else {
        // Weather search
        const filters = {};
        if (weatherCondition) filters.weather_code = weatherCondition;
        if (aqiRange) filters.aqi_range = aqiRange;
        
        searchResults = await searchAPI.searchByWeather(filters);
      }

      // Navigate to search results page with data
      navigate('/search-results', { 
        state: { 
          results: searchResults,
          searchType: activeTab,
          query: activeTab === "location" ? searchQuery : null,
          filters: activeTab === "weather" ? { weatherCondition, aqiRange } : null
        } 
      });

    } catch (error) {
      console.error('Search error:', error);
      alert(t('search.searchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name || suggestion.text);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="search-input-container">
                <input 
                  className='search-input' 
                  type="text" 
                  placeholder={t('search.searchText')}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span>{suggestion.name || suggestion.text}</span>
                        {suggestion.type && (
                          <small className="suggestion-type">{suggestion.type}</small>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (

            <div className='search-button-III'>
              <div className='search-button-III-A'>
                <p>{t('search.WeatherCondition')}</p>
                <select 
                  className="select-WeatherCondition"
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value)}
                >
                  <option value="">{t('search.selectWeatherCondition')}</option>
                  <option value="0">☀️ {t('weather.ClearSky')}</option>
                  <option value="1">🌤️ {t('weather.MainlyClear')}</option>
                  <option value="2">⛅ {t('weather.PartlyCloudy')}</option>
                  <option value="3">☁️ {t('weather.Overcast')}</option>
                  <option value="51">🌦️ {t('weather.LightDrizzle')}</option>
                  <option value="61">🌧️ {t('weather.SlightRain')}</option>
                  <option value="80">🌦️ {t('weather.SlightRainShowers')}</option>
                </select>
              </div>

              <div className='search-button-III-A'>
                <p>{t('search.AQL')}</p>
                <select 
                  className="select-WeatherCondition"
                  value={aqiRange}
                  onChange={(e) => setAqiRange(e.target.value)}
                >
                  <option value="">{t('search.selectAQI')}</option>
                  <option value="0-50">🟢 {t('aqi.Good')}</option>
                  <option value="51-100">🟡 {t('aqi.Moderate')}</option>
                  <option value="101-150">🟠 {t('aqi.UnhealthyForSensitiveGroups')}</option>
                </select>
              </div>
            </div>
          )}


          <div className='search-button-II'>
            <button 
              className='search' 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? t('search.searching') : t('search.search')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchLocationWeather; 