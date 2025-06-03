import React, { useState, useEffect } from 'react';
import './styles/RankPlaces.css';
import CardProvince from './cardProvince';

const RankPlaces = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/weather/rankings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Rankings data:', data);
          setWeatherData(data.data?.rankings?.slice(0, 3) || []);
        } else {
          console.error('Failed to fetch weather rankings');
        }
      } catch (error) {
        console.error('Error fetching weather rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="Rank-container">
      <h1>Top 3 Best Weather Locations in Thailand</h1>

      <div className="Rank-container-I">
        {loading ? (
          <p>Loading...</p>
        ) : (
          weatherData.map((location, index) => (
            <CardProvince key={index} locationData={location} />
          ))
        )}
      </div>

    </div>
  );
};

export default RankPlaces;