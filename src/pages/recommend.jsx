import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import RankPlaces from '../components/RankPlaces';
import ReccommendedTourist from '../components/ReccommendedTourist';
import RecommendedStay from "../components/RecommendedStay";
import RecommendedCamp from '../components/RecommendedCamp';


function Recommend() {
  return (
    <div>
      
       <SearchLocationWeather />
      <RankPlaces />
      <ReccommendedTourist /> 
      <RecommendedStay />
      <RecommendedCamp/>
    </div>
  );
}

export default Recommend;
