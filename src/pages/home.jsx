import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import Weather from '../components/Weather';
import RankPlaces from '../components/RankPlaces';


function Home() {
  return (
  <div>
      <SearchLocationWeather />
      <Weather />
      <RankPlaces />
    </div>
  );
}

export default Home;
