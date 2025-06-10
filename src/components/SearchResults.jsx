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
  const [expandedPlaceTypes, setExpandedPlaceTypes] = useState(new Set());
  const [sortBy, setSortBy] = useState('region'); // region, name, count
  const [showAllExpanded, setShowAllExpanded] = useState(false);

  const togglePlaceTypeExpansion = (provinceName, placeType) => {
    const key = `${provinceName}-${placeType}`;
    const newExpanded = new Set(expandedPlaceTypes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedPlaceTypes(newExpanded);
  };
  
  // ฟังก์ชันจัดกลุ่มสถานที่ตาม place type
  const groupPlacesByType = (places) => {
    return places.reduce((acc, place) => {
      const placeType = place.place_type?.name || place.place_type?.type_name;
      let category = 'tourist'; // default category
      
      if (placeType === 'camp') {
        category = 'camp';
      } else if (placeType === 'stay') {
        category = 'stay';
      }
      
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(place);
      
      return acc;
    }, {});
  };

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
      <div className="search-results-main-container">
        <div className="search-results-no-results">
          <h2>{t('search.noResultsFound')}</h2>
          <button onClick={() => navigate('/')} className="search-results-back-button">
            {t('search.backToSearch')}
          </button>
        </div>
      </div>
    );
  }

  const renderLocationResults = () => {
    if (!results.data?.places || results.data.places.length === 0) {
      return (
        <div className="search-results-no-results">
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

    if (sortedProvinceGroups.length === 0) {
      return (
        <div className="search-results-no-results">
          <h3>{t('search.noPlacesFound')}</h3>
        </div>
      );
    }

    return (
      <div className="province-grouped-results">
        {sortedProvinceGroups.map((provinceGroup, index) => {
          const isExpanded = expandedProvinces.has(provinceGroup.provinceName);
          
          // จัดกลุ่มสถานที่ตาม place type
          const placesByType = groupPlacesByType(provinceGroup.places);
          
          return (
            <div key={`province-${index}`} className="province-group" id={`province-${provinceGroup.provinceName}`}>
              <div className="province-header">
                <div className="province-info">
                  <h3 className="province-name-I">{provinceGroup.provinceName}</h3>
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
                  {provinceGroup.places.length > 6 && (
                    <button 
                      className="expand-button"
                      onClick={() => toggleProvinceExpansion(provinceGroup.provinceName)}
                    >
                      {isExpanded ? t('search.showLess') : t('search.showMore')}
                    </button>
                  )}
                </div>
              </div>

              {/* แสดงสถานที่แยกตาม place type */}
              <div className="place-types-container">
                {/* Tourist Places (อื่นๆ นอกจาก camp และ stay) */}
                {placesByType.tourist && placesByType.tourist.length > 0 && (
                  <div className="place-type-section tourist-places">
                    <h4 className="place-type-title">
                      <span className="place-type-icon">🏛️</span>
                      {t('search.touristAttractions')} ({placesByType.tourist.length})
                    </h4>
                    <div className="card-tourist-container">
                      {(() => {
                        const isPlaceTypeExpanded = expandedPlaceTypes.has(`${provinceGroup.provinceName}-tourist`);
                        const displayPlaces = isPlaceTypeExpanded ? placesByType.tourist : placesByType.tourist.slice(0, 3);
                        return displayPlaces.map((place) => (
                          <CardTourist
                            key={place.id_place}
                            id={place.posts[0].id_post}
                            province={place.province?.name}
                            name={place.name_place}
                            imgUrl={place.posts[0].image}
                            type="tourist"
                          />
                        ));
                      })()}
                    </div>
                    {placesByType.tourist.length > 3 && (
                      <button 
                        className="show-more-places-button"
                        onClick={() => togglePlaceTypeExpansion(provinceGroup.provinceName, 'tourist')}
                      >
                        {expandedPlaceTypes.has(`${provinceGroup.provinceName}-tourist`) 
                          ? t('search.showLess') 
                          : `${t('search.showMore')} (${placesByType.tourist.length - 3})`
                        }
                      </button>
                    )}
                  </div>
                )}

                {/* Camp Places */}
                {placesByType.camp && placesByType.camp.length > 0 && (
                  <div className="place-type-section camp-places">
                    <h4 className="place-type-title">
                      <span className="place-type-icon">⛺</span>
                      {t('search.campgrounds')} ({placesByType.camp.length})
                    </h4>
                    <div className="card-tourist-container">
                      {(() => {
                        const isPlaceTypeExpanded = expandedPlaceTypes.has(`${provinceGroup.provinceName}-camp`);
                        const displayPlaces = isPlaceTypeExpanded ? placesByType.camp : placesByType.camp.slice(0, 3);
                        return displayPlaces.map((place) => (
                          <CardTourist
                            key={place.id_place}
                            id={place.posts[0].id_post}
                            province={place.province?.name}
                            name={place.name_place}
                            imgUrl={place.posts[0].image}
                            type="camp"
                          />
                        ));
                      })()}
                    </div>
                    {placesByType.camp.length > 3 && (
                      <button 
                        className="show-more-places-button"
                        onClick={() => togglePlaceTypeExpansion(provinceGroup.provinceName, 'camp')}
                      >
                        {expandedPlaceTypes.has(`${provinceGroup.provinceName}-camp`) 
                          ? t('search.showLess') 
                          : `${t('search.showMore')} (${placesByType.camp.length - 3})`
                        }
                      </button>
                    )}
                  </div>
                )}

                {/* Stay Places */}
                {placesByType.stay && placesByType.stay.length > 0 && (
                  <div className="place-type-section stay-places">
                    <h4 className="place-type-title">
                      <span className="place-type-icon">🏨</span>
                      {t('search.accommodations')} ({placesByType.stay.length})
                    </h4>
                    <div className="card-tourist-container">
                      {(() => {
                        const isPlaceTypeExpanded = expandedPlaceTypes.has(`${provinceGroup.provinceName}-stay`);
                        const displayPlaces = isPlaceTypeExpanded ? placesByType.stay : placesByType.stay.slice(0, 3);
                        return displayPlaces.map((place) => (
                          <CardTourist
                            key={place.id_place}
                            id={place.posts[0].id_post}
                            province={place.province?.name}
                            name={place.name_place}
                            imgUrl={place.posts[0].image}
                            type="stay"
                          />
                        ));
                      })()}
                    </div>
                    {placesByType.stay.length > 3 && (
                      <button 
                        className="show-more-places-button"
                        onClick={() => togglePlaceTypeExpansion(provinceGroup.provinceName, 'stay')}
                      >
                        {expandedPlaceTypes.has(`${provinceGroup.provinceName}-stay`) 
                          ? t('search.showLess') 
                          : `${t('search.showMore')} (${placesByType.stay.length - 3})`
                        }
                      </button>
                    )}
                  </div>
                )}
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
        <div className="search-results-no-results">
          <h3>{t('search.noProvincesFound')}</h3>
        </div>
      );
    }

    return (
      <div>
        <div className="weather-search-summary">
          <h3>{t('search.foundPlacesInProvinces')}: {results.data.provinces.length} {t('search.provinces')}</h3>
          <p>{t('search.showingTopPlaces')}</p>
          
          {/* แสดงรายชื่อจังหวัดที่คลิกได้สำหรับ weather search */}
          <div className="found-provinces">
            <span className="provinces-label">{t('search.provinces')}: </span>
            {results.data.provinces.map((province, index) => (
              <span key={province.name}>
                <button 
                  className="province-link"
                  onClick={() => {
                    const element = document.getElementById(`province-${province.name}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {province.name}
                </button>
                {index < results.data.provinces.length - 1 && ', '}
              </span>
            ))}
          </div>
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

            // จัดกลุ่มสถานที่ตาม place type สำหรับ weather results
            const placesByType = groupPlacesByType(sortedPlaces);

            return (
              <div key={`weather-province-${provinceIndex}`} className="province-group weather-province-group" id={`province-${province.name}`}>
                <div className="province-header">
                  <h3 className="province-name-I">{province.name}</h3>
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
                
                {/* แสดงสถานที่แยกตาม place type สำหรับ weather results */}
                <div className="place-types-container">
                  {/* Tourist Places */}
                  {placesByType.tourist && placesByType.tourist.length > 0 && (
                    <div className="place-type-section tourist-places">
                      <h4 className="place-type-title">
                        <span className="place-type-icon">🏛️</span>
                        {t('search.touristAttractions')} ({placesByType.tourist.length})
                      </h4>
                      <div className="card-tourist-container">
                        {(() => {
                          const isPlaceTypeExpanded = expandedPlaceTypes.has(`${province.name}-tourist`);
                          const displayPlaces = isPlaceTypeExpanded ? placesByType.tourist : placesByType.tourist.slice(0, 3);
                          return displayPlaces.map((place, index) => (
                            <div key={`${place.id_place}-tourist-${index}`} className="weather-card-wrapper">
                              <CardTourist
                                id={place.id_place}
                                province={place.provinceName}
                                name={place.name_place}
                                imgUrl={place?.posts[0]?.image || null}
                                type="tourist"
                              />
                              {place.weatherScore && (
                                <div className="weather-card-badge">
                                  <span className="weather-score-badge">
                                    ⭐ {place.weatherScore.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                      {placesByType.tourist.length > 3 && (
                        <button 
                          className="show-more-places-button"
                          onClick={() => togglePlaceTypeExpansion(province.name, 'tourist')}
                        >
                          {expandedPlaceTypes.has(`${province.name}-tourist`) 
                            ? t('search.showLess') 
                            : `${t('search.showMore')} (${placesByType.tourist.length - 3})`
                          }
                        </button>
                      )}
                    </div>
                  )}

                  {/* Camp Places */}
                  {placesByType.camp && placesByType.camp.length > 0 && (
                    <div className="place-type-section camp-places">
                      <h4 className="place-type-title">
                        <span className="place-type-icon">⛺</span>
                        {t('search.campgrounds')} ({placesByType.camp.length})
                      </h4>
                      <div className="card-tourist-container">
                        {(() => {
                          const isPlaceTypeExpanded = expandedPlaceTypes.has(`${province.name}-camp`);
                          const displayPlaces = isPlaceTypeExpanded ? placesByType.camp : placesByType.camp.slice(0, 3);
                          return displayPlaces.map((place, index) => (
                            <div key={`${place.id_place}-camp-${index}`} className="weather-card-wrapper">
                              <CardTourist
                                id={place.id_place}
                                province={place.provinceName}
                                name={place.name_place}
                                imgUrl={place?.posts[0]?.image || null}
                                type="camp"
                              />
                              {place.weatherScore && (
                                <div className="weather-card-badge">
                                  <span className="weather-score-badge">
                                    ⭐ {place.weatherScore.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                      {placesByType.camp.length > 3 && (
                        <button 
                          className="show-more-places-button"
                          onClick={() => togglePlaceTypeExpansion(province.name, 'camp')}
                        >
                          {expandedPlaceTypes.has(`${province.name}-camp`) 
                            ? t('search.showLess') 
                            : `${t('search.showMore')} (${placesByType.camp.length - 3})`
                          }
                        </button>
                      )}
                    </div>
                  )}

                  {/* Stay Places */}
                  {placesByType.stay && placesByType.stay.length > 0 && (
                    <div className="place-type-section stay-places">
                      <h4 className="place-type-title">
                        <span className="place-type-icon">🏨</span>
                        {t('search.accommodations')} ({placesByType.stay.length})
                      </h4>
                      <div className="card-tourist-container">
                        {(() => {
                          const isPlaceTypeExpanded = expandedPlaceTypes.has(`${province.name}-stay`);
                          const displayPlaces = isPlaceTypeExpanded ? placesByType.stay : placesByType.stay.slice(0, 3);
                          return displayPlaces.map((place, index) => (
                            <div key={`${place.id_place}-stay-${index}`} className="weather-card-wrapper">
                              <CardTourist
                                id={place.id_place}
                                province={place.provinceName}
                                name={place.name_place}
                                imgUrl={place?.posts[0]?.image || null}
                                type="stay"
                              />
                              {place.weatherScore && (
                                <div className="weather-card-badge">
                                  <span className="weather-score-badge">
                                    ⭐ {place.weatherScore.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                      {placesByType.stay.length > 3 && (
                        <button 
                          className="show-more-places-button"
                          onClick={() => togglePlaceTypeExpansion(province.name, 'stay')}
                        >
                          {expandedPlaceTypes.has(`${province.name}-stay`) 
                            ? t('search.showLess') 
                            : `${t('search.showMore')} (${placesByType.stay.length - 3})`
                          }
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };



  return (
    <div className="search-results-main-container">
      <div className="search-results-header">
        <button onClick={() => navigate('/')} className="search-results-back-button">
          ← {t('search.backToSearch')}
        </button>

        <div className="search-results-info">
          {searchType === 'location' ? (
            <h1>{t('search.searchResultsFor')} "{query}"</h1>
          ) : (
            <h1>{t('search.weatherSearchResults')}</h1>
          )}

          {filters && (
            <div className="search-results-applied-filters">
              <span>{t('search.filters')}: </span>
              {filters.weatherCondition && (
                <span className="search-results-filter-tag">
                  {t(`weather.code_${filters.weatherCondition}`)}
                </span>
              )}
              {filters.aqiRange && (
                <span className="search-results-filter-tag">
                  AQI: {filters.aqiRange}
                </span>
              )}
            </div>
          )}

          <p className="search-results-count">
            {results.data?.total || 0} {t('search.resultsFound')}
          </p>
        </div>
      </div>

      <div className="search-results-content">
        {/* Results Summary */}
        {searchType === 'location' && results.data?.places && (
          <div className="results-summary">
            <div className="summary-header">
              <h2 className="summary-title">{t('search.searchSummary')}</h2>
              <p className="summary-description">
                {t('search.foundResultsIn')} {Object.keys(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).length} {t('search.provinces')}
              </p>
              
              {/* แสดงรายชื่อจังหวัดที่คลิกได้ */}
              <div className="found-provinces">
                <span className="provinces-label">{t('search.provinces')}: </span>
                {getSortedProvinceGroups(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).map((provinceGroup, index) => (
                  <span key={provinceGroup.provinceName}>
                    <button 
                      className="province-link"
                      onClick={() => {
                        const element = document.getElementById(`province-${provinceGroup.provinceName}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {provinceGroup.provinceName}
                    </button>
                    {index < getSortedProvinceGroups(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{Object.keys(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).length}</span>
                <span className="stat-label">{t('search.provinces')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{results.data.places.filter(place => place.posts && place.posts.length > 0).length}</span>
                <span className="stat-label">{t('search.places')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {results.data.places.filter(place => place.posts && place.posts.length > 0)
                    .reduce((total, place) => total + (place.posts ? place.posts.length : 0), 0)}
                </span>
                <span className="stat-label">{t('search.posts')}</span>
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
                <span className="expansion-indicator">
                  ({expandedProvinces.size}/{Object.keys(groupPlacesByProvince(results.data.places.filter(place => place.posts && place.posts.length > 0))).length})
                </span>
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
