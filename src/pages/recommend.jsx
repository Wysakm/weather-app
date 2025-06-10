import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import Weather from '../components/Weather';
import ReccommendedTourist from '../components/ReccommendedTourist';
import RecommendedStay from "../components/RecommendedStay";
import RecommendedCamp from '../components/RecommendedCamp';
import { Outlet, useParams } from 'react-router-dom';


function Recommend() {
  const { id } = useParams();

  if (!id) {
    return (
      <>
        <SearchLocationWeather />
        <Weather />
        <ReccommendedTourist />
        <RecommendedStay />
        <RecommendedCamp />
      </>
    );
  } else {
    return (
      <div>
        <Outlet />
      </div>
    );
  }
}

export default Recommend;
