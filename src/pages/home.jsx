import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import Weather from '../components/Weather';
import RankPlaces from '../components/RankPlaces';
import Map from '../components/Map';


function Home() {
  return (
  <div>
      <SearchLocationWeather />
      <Weather />
      <RankPlaces />
      <Map />
    </div>
  );
}

export default Home;
