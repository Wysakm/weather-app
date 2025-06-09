import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardTourist from './CardTourist';
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
      <div className="card-tourist-container">
        {results.data.places.map((place) => (
          place.posts && place.posts.length > 0 &&
          <CardTourist
            key={place.id_place}
            id={place.posts[0].id_post}
            province={place.province?.name}
            name={place.name_place}
            imgUrl={place.posts && place.posts.length > 0 ? place.posts[0].image : null}
            type={place.place_type?.name || "tourist"}
          />
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

    // Collect all places from all provinces that match weather criteria
    const allPlaces = [];
    results.data.provinces.forEach((province) => {
      if (province.places && province.places.length > 0) {
        province.places.forEach((place) => {
          allPlaces.push({
            ...place,
            provinceName: province.name,
            weatherScore: province.weather_scores && province.weather_scores[0]
              ? Number(province.weather_scores[0].score)
              : null,
            currentWeather: province.weather_data && province.weather_data[0]
              ? province.weather_data[0]
              : null,
            aqiData: province.aqi_data && province.aqi_data[0]
              ? province.aqi_data[0]
              : null
          });
        });
      }
    });

    // Sort places by weather score (highest first)
    const sortedPlaces = allPlaces.sort((a, b) => {
      const scoreA = a.weatherScore || 0;
      const scoreB = b.weatherScore || 0;
      return scoreB - scoreA;
    });

    if (sortedPlaces.length === 0) {
      return (
        <div className="no-results">
          <h3>{t('search.noPlacesFound')}</h3>
        </div>
      );
    }

    return (
      <div>
        <div className="weather-search-summary">
          <h3>{t('search.foundPlacesInProvinces')}: {results.data.provinces.length} {t('search.provinces')}</h3>
          <p>{t('search.showingTopPlaces')}</p>
        </div>
        <div className="card-tourist-container">
          {sortedPlaces.slice(0, 12).map((place, index) => (
            <div key={`${place.id_place}-${index}`} className="weather-card-wrapper">
              <CardTourist
                id={place.id_place}
                province={place.provinceName}
                name={place.name_place}
                imgUrl={place?.posts[0]?.image || null} // We'll rely on CardTourist's fallback image handling
                type={place.place_type?.name || "tourist"}
              />
              {place.weatherScore && (
                <div className="weather-card-badge">
                  <span className="weather-score-badge">
                    ⭐ {place.weatherScore.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
