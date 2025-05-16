import React from 'react';
import SearchLocationWeather from '../components/SearchLocationWeather';
import Weather from '../components/Weather';


function Home() {
  return (
  <div>
      <SearchLocationWeather />
      <Weather />
    </div>
  );
}

export default Home;
