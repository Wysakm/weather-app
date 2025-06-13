import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/image/bg-campstay.webp';
import campIcon from '../assets/image/camp-icon.svg';
import stayIcon from '../assets/image/stay-icon.svg';
import { searchAPI } from '../api/search';
import './styles/SearchLocationWeather.css';

// Place type ID mapping
const PLACE_TYPE_IDS = {
  camp: "2f927a66-5095-4662-82ae-19e0aed24e41",
  stay: "dafd3916-8351-4aed-a125-570daf4fdf47"
};

function SearchCampStay() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("camp");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Handle search input with autocomplete
  const handleSearchInput = (value) => {
    setSearchText(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for suggestions
    if (value.trim().length > 2) {
      searchTimeout.current = setTimeout(async () => {
        try {
          // Get suggestions using the dedicated suggestions endpoint
          const response = await searchAPI.getSuggestions(value, 'place');

          // Filter suggestions by current place type (could be enhanced later)
          const filteredSuggestions = response.data?.filter(suggestion => {
            return suggestion.type === 'place';
          }) || [];

          setSuggestions(filteredSuggestions.slice(0, 5));
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
    if (!searchText.trim()) {
      alert(t('search.pleaseEnterLocation'));
      return;
    }

    setIsLoading(true);

    try {
      // Determine place type filter based on active tab using UUID
      const placeTypeId = PLACE_TYPE_IDS[activeTab];

      // Search with place type filter
      const searchResults = await searchAPI.searchLocations(searchText, {
        place_type_id: placeTypeId
      });

      // Navigate to search results page with filtered data
      navigate('/search-results', {
        state: {
          results: searchResults,
          searchType: 'location',
          query: searchText,
          filters: { placeType: activeTab }
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
    setSearchText(suggestion.name || suggestion.text);
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

  // Clear suggestions when tab changes
  useEffect(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    // If there's existing search text, refresh suggestions for new tab
    if (searchText.trim().length > 2) {
      const placeTypeId = PLACE_TYPE_IDS[activeTab];

      const fetchSuggestions = async () => {
        try {
          const response = await searchAPI.searchLocations(searchText, {
            place_type_id: placeTypeId,
            limit: 5
          });

          const placeSuggestions = response.data?.places?.map(place => ({
            type: 'place',
            id: place.id_place,
            text: place.name_place,
            subtitle: place.province?.name
          })) || [];

          setSuggestions(placeSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    }
  }, [activeTab, searchText]);

  return (
    <div className='search-container-I' style={{ backgroundImage: `url(${bgImage})` }}>
      <div className='searchBox-I'>
        <div className='searchText-I'>
          <h1>{t('search.Discover')}</h1>
        </div>
        <div className='searchText-II'>
          <h1>{t('search.based')}</h1>
        </div>

        <div className="tab-container">
          <div
            className={`tab ${activeTab === "camp" ? "active" : ""}`}
            onClick={() => setActiveTab("camp")}
            data-tab="camp"
          >
            <img
              src={campIcon}
              alt="camp-icon"
              className={activeTab === "camp" ? "icon active" : "icon"}
            />
            {t('Recommend.Camp')}
          </div>
          <div
            className={`tab ${activeTab === "stay" ? "active" : ""}`}
            onClick={() => setActiveTab("stay")}
            data-tab="stay"
          >
            <img
              src={stayIcon}
              alt="stay-icon"
              className={activeTab === "stay" ? "icon active" : "icon"}
            />
            {t('Recommend.Stay')}
          </div>
        </div>

        <div className={`search-button ${activeTab === 'camp' ? 'camp-active' : 'stay-active'}`}>
          <div className='search-button-I'>
            <p>{activeTab === "camp" ? t('search.location') : t('search.location')}</p>
            <div className="search-input-container">
              <input
                className='search-input'
                type="text"
                value={searchText}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder={activeTab === "camp" ? t('search.searchText') : t('search.searchText')}
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
                      {suggestion.subtitle && <small>{suggestion.subtitle}</small>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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

export default SearchCampStay;