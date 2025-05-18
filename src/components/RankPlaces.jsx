import React from 'react';
import './styles/RankPlaces.css';
import CardProvince from './cardProvince';

const RankPlaces = () => {
  return (
    <div className="Rank-container">
      <h1>Best weather</h1>

      <div className="Rank-container-I">
        <CardProvince />
        <CardProvince />
        <CardProvince />
      </div>

    </div>
  );
};

export default RankPlaces;