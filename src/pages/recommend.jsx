import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import RankPlaces from '../components/RankPlaces';
import ReccommendedTourist from '../components/ReccommendedTourist';


function Recommend() {
  return (
    <div>
      
       <SearchLocationWeather />
      <RankPlaces />
      <ReccommendedTourist /> 
    </div>
  );
}

export default Recommend;
