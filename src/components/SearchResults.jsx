import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardTourist from './CardTourist';
import { groupPlacesByProvince, getSortedProvinceGroups } from '../utils/regionUtils';
import './styles/SearchResults.css';

function SearchResults() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchType, query, filters } = location.state || {};
  const [expandedProvinces, setExpandedProvinces] = useState(new Set());
  const [sortBy, setSortBy] = useState('region'); // region, name, count
  const [showAllExpanded, setShowAllExpanded] = useState(false);

  const toggleProvinceExpansion = (provinceName) => {
    const newExpanded = new Set(expandedProvinces);
    if (newExpanded.has(provinceName)) {
      newExpanded.delete(provinceName);
    } else {
      newExpanded.add(provinceName);
    }
    setExpandedProvinces(newExpanded);
  };

  const toggleAllProvinces = () => {
    if (showAllExpanded) {
      setExpandedProvinces(new Set());
    } else {
      const allProvinceNames = new Set(
        getSortedProvinceGroups(groupPlacesByProvince(
          results.data?.places?.filter(place => place.posts && place.posts.length > 0) || []
        )).map(group => group.provinceName)
      );
      setExpandedProvinces(allProvinceNames);
    }
    setShowAllExpanded(!showAllExpanded);
  };

  const sortProvinceGroups = (groups, sortCriteria) => {
    const sortedGroups = [...groups];
    
    switch (sortCriteria) {
      case 'name':
        return sortedGroups.sort((a, b) => 
          a.provinceName.localeCompare(b.provinceName, 'th')
        );
      case 'count':
        return sortedGroups.sort((a, b) => 
          b.places.length - a.places.length
        );
      case 'region':
      default:
        return sortedGroups; // Already sorted by region in getSortedProvinceGroups
    }
  };

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

    // Filter places that have posts
    const placesWithPosts = results.data.places.filter(place => 
      place.posts && place.posts.length > 0
    );

    // Group places by province
    const groupedPlaces = groupPlacesByProvince(placesWithPosts);
    const sortedProvinceGroups = sortProvinceGroups(
      getSortedProvinceGroups(groupedPlaces), 
      sortBy
    );
    const finalSortedProvinceGroups = sortProvinceGroups(sortedProvinceGroups, sortBy);

    if (finalSortedProvinceGroups.length === 0) {
      return (
        <div className="no-results">
          <h3>{t('search.noPlacesFound')}</h3>
        </div>
      );
    }

    return (
      <div className="province-grouped-results">
        {finalSortedProvinceGroups.map((provinceGroup, index) => {
          const isExpanded = expandedProvinces.has(provinceGroup.provinceName);
          const displayPlaces = isExpanded ? provinceGroup.places : provinceGroup.places.slice(0, 3);
          
          return (
            <div key={`province-${index}`} className="province-group">
              <div className="province-header">
                <div className="province-info">
                  <h3 className="province-name">{provinceGroup.provinceName}</h3>
                  {provinceGroup.region && (
                    <span className="region-badge">
                      {provinceGroup.region.name.th}
                    </span>
                  )}
                </div>
                <div className="province-controls">
                  <span className="place-count">
                    {provinceGroup.places.length} {t('search.places')}
                  </span>
                  {provinceGroup.places.length > 3 && (
                    <button 
                      className="expand-button"
                      onClick={() => toggleProvinceExpansion(provinceGroup.provinceName)}
                    >
                      {isExpanded ? t('search.showLess') : t('search.showMore')}
                    </button>
                  )}
                </div>
              </div>
              <div className="card-tourist-container">
                {displayPlaces.map((place) => (
                  <CardTourist
                    key={place.id_place}
                    id={place.posts[0].id_post}
                    province={place.province?.name}
                    name={place.name_place}
                    imgUrl={place.posts[0].image}
                    type={place.place_type?.name || "tourist"}
                  />
                ))}
              </div>
            </div>
          );
        })}
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
      <div>
        <div className="weather-search-summary">
          <h3>{t('search.foundPlacesInProvinces')}: {results.data.provinces.length} {t('search.provinces')}</h3>
          <p>{t('search.showingTopPlaces')}</p>
        </div>
        
        {/* Group places by province for weather results */}
        <div className="province-grouped-results">
          {results.data.provinces.map((province, provinceIndex) => {
            if (!province.places || province.places.length === 0) return null;
            
            // Sort places by weather score within each province
            const sortedPlaces = province.places
              .map(place => ({
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
              }))
              .sort((a, b) => {
                const scoreA = a.weatherScore || 0;
                const scoreB = b.weatherScore || 0;
                return scoreB - scoreA;
              });

            return (
              <div key={`weather-province-${provinceIndex}`} className="province-group weather-province-group">
                <div className="province-header">
                  <h3 className="province-name">{province.name}</h3>
                  <div className="province-weather-info">
                    {province.weather_scores && province.weather_scores[0] && (
                      <span className="weather-score-badge">
                        ⭐ {Number(province.weather_scores[0].score).toFixed(1)}
                      </span>
                    )}
                    <span className="place-count">
                      {sortedPlaces.length} {t('search.places')}
                    </span>
                  </div>
                </div>
                <div className="card-tourist-container">
                  {sortedPlaces.slice(0, 6).map((place, index) => (
                    <div key={`${place.id_place}-${index}`} className="weather-card-wrapper">
                      <CardTourist
                        id={place.id_place}
                        province={place.provinceName}
                        name={place.name_place}
                        imgUrl={place?.posts[0]?.image || null}
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
          })}
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
        {/* Results Summary */}
        {searchType === 'location' && results.data?.places && (
          <div className="results-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{Object.keys(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).length}</span>
                <span className="stat-label">{t('search.provinces')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{results.data.places.filter(place => place.posts && place.posts.length > 0).length}</span>
                <span className="stat-label">{t('search.places')}</span>
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="sort-controls">
              <div className="sort-section">
                <label className="sort-label">{t('search.sortBy')}:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="region">{t('search.byRegion')}</option>
                  <option value="name">{t('search.byProvinceName')}</option>
                  <option value="count">{t('search.byPlaceCount')}</option>
                </select>
              </div>
              
              <button 
                onClick={toggleAllProvinces}
                className="expand-all-button"
              >
                {showAllExpanded ? t('search.collapseAll') : t('search.expandAll')}
              </button>
            </div>
          </div>
        )}
        
        {searchType === 'location' ? renderLocationResults() : renderWeatherResults()}
      </div>
    </div>
  );
}

export default SearchResults;
