import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/image/bg-campstay.webp';
import campIcon from '../assets/image/camp-icon.svg';
import stayIcon from '../assets/image/stay-icon.svg';
import './styles/SearchLocationWeather.css';

function SearchCampStay() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("camp");
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim()) {
      if (activeTab === "camp") {
        navigate(`/campStay/camp/${searchText}`);
      } else {
        navigate(`/campStay/stay/${searchText}`);
      }
    }
  };

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
            <input
              className='search-input'
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={activeTab === "camp" ? t('search.searchText') : t('search.searchText')}
            />
          </div>

          <div className='search-button-II'>
            <button
              className='search'
              onClick={handleSearch}
            >
              {t('search.search')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCampStay;