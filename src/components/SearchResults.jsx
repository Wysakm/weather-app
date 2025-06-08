import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './styles/SearchResults.css';

function SearchResults() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchType, query, filters } = location.state || {};

  if (!results) {
    return (
      <div className="search-results-container">
        <div className="no-results">
          <h2>{t('search.noResultsFound')}</h2>
          <button onClick={() => navigate('/')} className="back-button">
            {t('search.backToSearch')}
          </button>
        </div>
      </div>
    );
  }

  const renderLocationResults = () => {
    if (!results.data?.places || results.data.places.length === 0) {
      return (
        <div className="no-results">
          <h3>{t('search.noPlacesFound')}</h3>
        </div>
      );
    }

    return (
      <div className="results-grid">
        {results.data.places.map((place) => (
          <div key={place.id_place} className="result-card">
            <div className="place-info">
              <h3>{place.name_place}</h3>
              <p className="location">{place.district}, {place.province?.name}</p>
              <p className="place-type">{place.place_type?.name}</p>
              
              {place._count?.posts > 0 && (
                <p className="posts-count">
                  {place._count.posts} {t('search.posts')}
                </p>
              )}
            </div>
            
            {place.posts && place.posts.length > 0 && (
              <div className="place-posts">
                <h4>{t('search.recentPosts')}</h4>
                <div className="posts-preview">
                  {place.posts.slice(0, 2).map((post) => (
                    <div key={post.id_post} className="post-preview">
                      {post.image && (
                        <img src={post.image} alt={post.title} className="post-thumbnail" />
                      )}
                      <span className="post-title">{post.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              className="view-place-btn"
              onClick={() => navigate(`/places/${place.id_place}`)}
            >
              {t('search.viewPlace')}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderWeatherResults = () => {
    if (!results.data?.provinces || results.data.provinces.length === 0) {
      return (
        <div className="no-results">
          <h3>{t('search.noProvincesFound')}</h3>
        </div>
      );
    }

    return (
      <div className="results-grid">
        {results.data.provinces.map((province) => (
          <div key={province.id} className="result-card province-card">
            <div className="province-info">
              <h3>{province.name}</h3>
              
              {province.weather_scores && province.weather_scores[0] && (
                <div className="weather-score">
                  <span className="score-label">{t('weather.score')}: </span>
                  <span className="score-value">
                    {Number(province.weather_scores[0].score).toFixed(1)}/5
                  </span>
                </div>
              )}
              
              {province.weather_data && province.weather_data[0] && (
                <div className="current-weather">
                  <span className="weather-condition">
                    {t(`weather.code_${province.weather_data[0].weather_code}`)}
                  </span>
                  <span className="temperature">
                    {province.weather_data[0].temperature}°C
                  </span>
                </div>
              )}
              
              {province.aqi_data && province.aqi_data[0] && (
                <div className="aqi-info">
                  <span className="aqi-label">AQI: </span>
                  <span className={`aqi-value aqi-${getAQILevel(province.aqi_data[0].aqi)}`}>
                    {province.aqi_data[0].aqi}
                  </span>
                </div>
              )}
            </div>
            
            {province.places && province.places.length > 0 && (
              <div className="province-places">
                <h4>{t('search.topPlaces')} ({province.places.length})</h4>
                <div className="places-list">
                  {province.places.slice(0, 3).map((place) => (
                    <div key={place.id_place} className="place-item">
                      <span className="place-name">{place.name_place}</span>
                      <span className="place-posts">
                        {place._count?.posts || 0} {t('search.posts')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              className="view-province-btn"
              onClick={() => navigate(`/provinces/${province.id}`)}
            >
              {t('search.viewProvince')}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    return 'unhealthy';
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← {t('search.backToSearch')}
        </button>
        
        <div className="search-info">
          {searchType === 'location' ? (
            <h1>{t('search.searchResultsFor')} "{query}"</h1>
          ) : (
            <h1>{t('search.weatherSearchResults')}</h1>
          )}
          
          {filters && (
            <div className="applied-filters">
              <span>{t('search.filters')}: </span>
              {filters.weatherCondition && (
                <span className="filter-tag">
                  {t(`weather.code_${filters.weatherCondition}`)}
                </span>
              )}
              {filters.aqiRange && (
                <span className="filter-tag">
                  AQI: {filters.aqiRange}
                </span>
              )}
            </div>
          )}
          
          <p className="results-count">
            {results.data?.total || 0} {t('search.resultsFound')}
          </p>
        </div>
      </div>

      <div className="search-results-content">
        {searchType === 'location' ? renderLocationResults() : renderWeatherResults()}
      </div>
    </div>
  );
}

export default SearchResults;
