import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/SearchLocationWeather.css';


function SearchLocationWeather() {
  const { t } = useTranslation(); // ✅ เหลือแค่ t พอ

  return (
    <div className='search-container-I'>
      <div className='searchBox-I'>
        <div className='searchText-I'>
          <h1>
            {t('search.Discover')}
          </h1>
          </div>
        <div className='searchText-II'>
          <h1>
            {t('search.based')}
          </h1>
        </div>

           <div className='search-botton'>
        ddd

      </div>
      </div>

          </div>
  );
}

export default SearchLocationWeather;